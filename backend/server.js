// Import lines
/* ---------------------------------------------------------------------------------------- */
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const cors = require("cors");
const app = express();
/* ---------------------------------------------------------------------------------------- */


// Configuring salt rounds for bcrypt hashing
/* ---------------------------------------------------------------------------------------- */
const saltRounds = 10;
/* ---------------------------------------------------------------------------------------- */


// Use commands
/* ---------------------------------------------------------------------------------------- */
app.use(flash());
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: 'secret-here',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, httpOnly: true}
}));
app.use(passport.initialize());
app.use(passport.session());
/* ---------------------------------------------------------------------------------------- */


// MongoDB and Mongoose stuff
/* ---------------------------------------------------------------------------------------- */
// Connecting to my MongoDB database
mongoose.connect("***REMOVED***")
.then(() => {
    console.log("Connected to MongoDB");
}
).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

// User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Making an instance of a user from the schema defined above
const User = mongoose.model("User", userSchema);

// Function to create a new user (register option)
async function createUser(newUsername, newPassword) {
    const user = new User({
        username: newUsername,
        password: newPassword
    });
    await user.save();
}

// Post schema
const postSchema = new mongoose.Schema({ 
    title: { type: String, required: true }, 
    content: { type: String, required: true }, 
    tags: [String],  // Example: ['nodejs', 'express'] 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    createdAt: { type: Date, default: Date.now } 
});

// Making an instance of a post from the schema defined above
const Post = mongoose.model("Post", postSchema);

// Function to create a new post
async function createPost(newTitle, newContent, newTags, userId) {
    const post = new Post({
        title: newTitle,
        content: newContent,
        tags: newTags,
        createdBy: userId
    });
    await post.save();
}

async function getPostsAndAddUsername(query) {
    let posts = []
    if (query === undefined) {
        posts = await Post.find({});
    } else {
        // This (?i) and (?-i) means all of the query (begin and end) are case insensitive.
        posts = await Post.find({ 
            $or: [
                { title: { $regex: `${query}`, $options: "i" } },
                { tags: { $regex: `${query}`, $options: "i" } }
            ]
        });
    }

    const postsWithUsername = [];

    for (let post of posts) {
        let modifiedPost = {};

        postCreatedById = post.createdBy;
        const user = await User.findOne({_id: postCreatedById});
        const username = user.username;

        // Have to do all this because for some reason I cannot directly modify post.
        modifiedPost = {_id: post._id, title: post.title, content: post.content, tags: post.tags,
            createdBy: username, createdAt: post.createdAt, __v: post.__v};

        postsWithUsername.push(modifiedPost);
    }

    return postsWithUsername;
}
/* ---------------------------------------------------------------------------------------- */


// Passport stuff
/* ---------------------------------------------------------------------------------------- */
// Configuring the local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({username: username})

    if (user !== null) {
        bcrypt.compare(password, user.password, function(err, result) {
            if (result) {
                return done(null, user);
            } else {
                return done(null, false, {message: "Incorrect password for user: " + user.username});
            }
        });
    } else {
        return done(null, false, {message: "Username does not exist"});
    }
}));

// Serializing user to the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializing user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
/* ---------------------------------------------------------------------------------------- */


// Route handlers (IMPORTANT NOTE: This is API. So everything pre-fixed with API.)
/* ---------------------------------------------------------------------------------------- */
app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({message: "Logged in", user: req.user.username});
});

app.get("/api/home", async (req, res) => {
    const query = req.query.search;
    const posts = await getPostsAndAddUsername(query);
    res.json({posts: posts})
});

app.get("/api/post/:postId", async (req, res) => {
    const post = await Post.findOne({_id: req.params.postId});
    const postCreatedById = post.createdBy;
    const user = await User.findOne({_id: postCreatedById});
    const username = user.username;

    // Have to do all this because for some reason I cannot directly modify post.
    modifiedPost = {_id: post._id, title: post.title, content: post.content, tags: post.tags,
    createdBy: username, createdAt: post.createdAt, __v: post.__v};

    res.json({post: modifiedPost});
});

app.get("/user/:username", async (req, res) => {
    const user = await User.findOne({username: req.params.username})
    const userId = user._id;

    const userPosts = await Post.find({createdBy: userId});

    res.json({usersPosts: userPosts});
})
/* ---------------------------------------------------------------------------------------- */


app.listen(5000, () => {
    console.log("Listening on port 5000 (React)");
});