const express = require('express');
const { PostModel } = require('../models/Post.model');

const postRouter = express.Router()

postRouter.post('/create', async (req, res) => {
    const { title, body, device, comments } = req.body;
    if (device == "laptop" || device == "tab" || device == "mobile") {
        try {
            const newPost = new PostModel(req.body);
            await newPost.save();
            res.status(200).send({ msg: "New Post created" })
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
    else {
        res.status(400).send({ msg: "Incorrect data" })
    }

})


postRouter.get('/', async (req, res) => {
    const { q } = req.query;
    const {q1, q2} = req.query
    try {
        if(q){
            const posts = await PostModel.find({ userId: req.body.userId, device: q });
            res.status(200).send(posts)
        }
        else if(q1){
            const posts = await PostModel.find({ userId: req.body.userId, device: [q1,q2] });
            res.status(200).send(posts)
        }
        else{
            const posts = await PostModel.find({ userId: req.body.userId });
            res.status(200).send(posts)
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})



postRouter.get('/top', async (req, res) => {
    try {
        const posts = await PostModel.find({ userId: req.body.userId }).sort({ comments: -1 });
        res.status(200).send(posts[0])
    } catch (error) {
        res.status(400).send(error.message);
    }
})




postRouter.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostModel.find({ _id: id });
        if (req.body.userId == post.userId) {
            await PostModel.findByIdAndUpdate({ _id: id }, req.body);
            res.status(200).send("Updated")
        }
        else {
            res.status(200).send("ur not allowed to do this")
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})


postRouter.patch('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostModel.find({ _id: id });
        if (req.body.userId == post.userId) {
            await PostModel.findByIdAndDelete({ _id: id });
            res.status(200).send("deleted")
        }
        else {
            res.status(200).send("ur not allowed to do this")
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})


module.exports = {
    postRouter
}