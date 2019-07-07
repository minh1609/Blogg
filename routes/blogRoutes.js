const mongoose = require("mongoose");
const express = require("express");
const requireLogin = require("../middlewares/requireLogin");
const cleanCache = require("../middlewares/cleanCache");
const Blog = mongoose.model("Blog");

module.exports = (app = express()) => {
    app.get("/api/blogs/:id", requireLogin, async (req, res) => {
        const blog = await Blog.findOne({
            _user: req.user.id,
            _id: req.params.id
        });

        res.status(200).send(blog);
    });

    app.get("/api/blogs", requireLogin, async (req, res) => {
        const blogs = await Blog.find({ _user: req.user.id }).cache({
            key: req.user.id
        });
        res.status(200).send(blogs);
    });
    //when ever user create a new post, old cache for this user will be deleted
    app.post("/api/blogs", requireLogin, cleanCache, async (req, res) => {
        const { title, content, imageUrl } = req.body;

        const blog = new Blog({
            title,
            content,
            imageUrl,
            _user: req.user.id
        });

        try {
            await blog.save();
            res.send(blog);
        } catch (err) {
            res.send(400, err);
        }
    });

    app.delete("/api/blogs/:id", async (req, res) => {
        await Blog.findByIdAndDelete(req.params.id);
        console.log(req.params.id);

        res.send({ status: "deleted" });
    });
};
