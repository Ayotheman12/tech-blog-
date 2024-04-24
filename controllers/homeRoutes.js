const router = require("express").Router();
const {Post, User, Comment} = require("../models");
const withAuth = require("../utils/auth");

// Homepage
router.get("/", async (req, res) => {
    try {
        // Get all blog posts
        const postData = Post.findAll({
            include: {
                model: User,
                attributes: ["username"]
            }
        });

        // Serialize the data
        const posts = (await postData).map((post) => post.get({plain: true}));

        // Render page
        res.render("homepage", {
            title: "Tech Blog",
            loggedIn: req.session.loggedIn,
            posts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Dashboard
router.get("/dashboard", withAuth, async (req, res) => {
    try {
        // Get the user's posts
        const postData = await Post.findAll({
            where: {
                user_id: req.session.userId
            }
        });

        // Serialize the data
        const posts = postData.map((post) => post.get({plain: true}));

        // Render the page
        res.render("dashboard", {
            editor: {
                enabled: false
            },
            title: "Your Dashboard",
            loggedIn: req.session.loggedIn,
            posts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Dashboard post editor - new post
router.get("/dashboard/edit", withAuth, async (req, res) => {
    try {
        // Get the user's posts
        const postData = await Post.findAll({
            where: {
                user_id: req.session.userId
            }
        });

        // Serialize the data
        const posts = postData.map((post) => post.get({plain: true}));

        // Render the page
        res.render("dashboard", {
            editor: {
                enabled: true,
                type: "create"
            },
            title: "Your Dashboard",
            loggedIn: req.session.loggedIn,
            posts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Dashboard post editor - update post
router.get("/dashboard/edit/:id", withAuth, async (req, res) => {
    try {
        // Get the user's posts
        const postData = await Post.findAll({
            where: {
                user_id: req.session.userId
            }
        });

        // Serialize the data
        const posts = postData.map((post) => post.get({plain: true}));

        console.log(req.params.id);

        // Render the page
        res.render("dashboard", {
            editor: {
                enabled: true,
                type: "update",
                edit_id: Number(req.params.id)
            },
            title: "Your Dashboard",
            loggedIn: req.session.loggedIn,
            posts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Post Page
router.get("/post/:id", withAuth, async (req, res) => {
    try {
        // Get the post
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ["username"]
                }
            ]
        });

        // Get the comments
        const commentData = await Comment.findAll({
            where: {
                post_id: req.params.id
            },
            include: {
                model: User,
                attributes: ["username"]
            }
        });

        // Serialize the data
        const post = postData.get({plain: true});
        const comments = commentData.map((comment) => comment.get({plain: true}));

        // Render the page
        res.render("post", {
            title: "Tech Blog",
            loggedIn: req.session.loggedIn,
            post,
            comments
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Login Page
router.get("/login", async (req, res) => {
    // Redirect to the dashboard if the user is logged in
    if (req.session.loggedIn) {
        res.redirect("/dashboard");
        return;
    }

    // Render the page
    res.render("login", {
        title: "Tech Blog",
        loggedIn: req.session.loggedIn
    });
});

module.exports = router;