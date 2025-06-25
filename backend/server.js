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
const { Server } = require('socket.io');
require('dotenv').config();
/* ---------------------------------------------------------------------------------------- */


// Configuring salt rounds for bcrypt hashing
/* ---------------------------------------------------------------------------------------- */
const saltRounds = 10;
/* ---------------------------------------------------------------------------------------- */


// Use commands
/* ---------------------------------------------------------------------------------------- */
app.use(flash());
app.use(cors());
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
mongoose.connect(process.env.MONGO_URI)
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
    return post;
}

const subscriptionSchema = new mongoose.Schema({
    subscriber: String,
    creator: String
})

const Subscription = mongoose.model("Subscription", subscriptionSchema);

async function createSubscription(newSubscriber, newCreator) {
    const subscription = new Subscription({
        subscriber: newSubscriber,
        creator: newCreator
    });
    await subscription.save();
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


const server = app.listen(5000, () => {
    console.log("Listening on port 5000 (React)");
});

const io = new Server(server, {
    cors: {
        origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

// Used to show the active users on this blog site.
const activeUsers = {};
io.on('connection', socket => {
    socket.on('user_connection', (username) => {
        // Used to test if value in object. Credit: https://stackoverflow.com/a/57944826/14367246
        let alreadyConnected = Object.values(activeUsers).includes(username);
        if (!alreadyConnected) {
            activeUsers[socket.id] = username;  // Adding an id and username to active users.
        }
        io.emit('active_users', activeUsers);
    })

    socket.on('disconnect', () => {
        delete activeUsers[socket.id];
        io.emit('active_users', activeUsers)
    })
})


// Route handlers (IMPORTANT NOTE: This is API. So everything pre-fixed with API.)
/* ---------------------------------------------------------------------------------------- */
// Login page
app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({message: "Logged in", user: req.user.username});
});

// Register page
app.post("/api/register", async (req, res) => {
    const username = req.body.newUsername;
    const password = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword

    const userFound = await User.findOne({username: username})

    if (userFound !== null) {
        return res.status(400).json({error: "Username already exists"});
    } else {
        if (password === confirmPassword) {
            encryptedPassword = bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) {
                    return res.status(400).json({error: "Something wrong happened with registration"});
                } else {
                    createUser(username, hash);
                    res.json({message: "Registration successful", user: req.body.newUsername});
                }
            });
        } else {
            return res.status(400).json({error: "Passwords do not match!"});
        }
    }
});

// Home page
app.get("/api/home", async (req, res) => {
    const query = req.query.search;
    const posts = await getPostsAndAddUsername(query);
    res.json({posts: posts})
});

// For displaying a post in detail
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

// For displaying an author profile page
app.get("/api/user/:username", async (req, res) => {
    const user = await User.findOne({username: req.params.username})
    const userId = user._id;

    const userPosts = await Post.find({createdBy: userId});

    res.json({usersPosts: userPosts});
});

// For editing a post
app.post("/api/post/:postId/edit", async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const tagsArray = tags.split(" ");

    await Post.findOneAndUpdate({_id: req.params.postId},
        {
            title: title,
            content: content,
            tags: tagsArray
        }
    );

    res.json({message: "Post edited successfully."})
});

// For deleting a post
app.post("/api/post/:postId/delete", async (req, res) => {
    await Post.deleteOne({_id: req.params.postId});

    res.json({message: "Post deleted successfully."});
})

// For creating a new post
app.post("/api/newpost", async (req, res) => {
    // Needed to get the user id from username, used to find post to add.
    const user = await User.findOne({username: req.body.username});

    const userId = user._id;
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const tagsArray = tags.split(" ");

    const post = await createPost(title, content, tagsArray, userId);

    // Find subscribers of the author
    const subscriptions = await Subscription.find({creator: req.body.username});
    // We go through each subscriber of this author
    for (const subscription of subscriptions) {
        subscriber = subscription['subscriber'];
        console.log(activeUsers);
        for (const [key, value] of Object.entries(activeUsers)) {
            // If one of the active users are the author's subscriber, we emit a post
            if (value === subscriber) {
                // key is the socketId saved in activeUsers
                io.to(key).emit("new_post", {
                    title: post.title,
                    creator: req.body.username
                })
            }
        }
    }

    res.json({message: "Post created successfully."});
});

// For subscribing a user to an author
app.post("/api/subscribe", async (req, res) => {
    const subscriber = req.body.subscriber;
    const creator = req.body.creator;

    const checkExistingSubscription = await Subscription.findOne({subscriber: subscriber, creator: creator});
    if (checkExistingSubscription) {
        res.json({message: "This subscription already exists"});
    } else {
        await createSubscription(subscriber, creator);
    }

    res.json({message: `Subscription between ${subscriber} and ${creator} successful.`});
})

// For unsubscribing to an author
app.post("/api/unsubscribe", async (req, res) => {
    const subscriber = req.body.subscriber;
    const creator = req.body.creator;

    await Subscription.deleteOne({subscriber: subscriber, creator: creator});

    res.json({message: `Unsubscribed between ${subscriber} and ${creator}`});
})

// For finding if a user is subscribed to a creator
app.get("/api/subscriptions", async (req, res) => {
    const subscriber = req.query.subscriber;
    const creator = req.query.creator;

    const checkExistingSubscription = await Subscription.findOne({subscriber: subscriber, creator: creator});
    if (checkExistingSubscription) {
        res.json({subscriptionStatus: "Subscribed"});
    } else {
        res.json({subscriptionStatus: "Not Subscribed"});
    }
})

// For finding all creators a user is subscribed to.
app.get("/api/allsubscriptions", async (req, res) => {
    const findAllSubscriptions = await Subscription.find({subscriber: req.query.subscriber});

    const creators = []
    for (const subscription of findAllSubscriptions) {
        creators.push(subscription['creator']);
    }
    res.json({allsubscriptions: creators});
})
/* ---------------------------------------------------------------------------------------- */