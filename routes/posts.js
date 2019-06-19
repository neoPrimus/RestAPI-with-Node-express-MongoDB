const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { TokenAuthentication } = require("../validation/authentication")

// Get all the post can limit the post by adding .limit after find()
router.get('/getAllpost',TokenAuthentication, async (req, res) => {
    console.log(TokenAuthentication)
    try {
        let allPost = await Post.find()
        .then(result=>{
            if(result.length>0){
                let allPost = result;
                res.json(allPost)
            }else{
                res.send("Sorry no post")
            }
        })
        .catch(err=>{
            console.log(err)
        })
    } catch (err) {
        res.json({ message: err })
    }
})

// Post a post into the database and check that it is already in database if so then don't save 
router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    })

    try {
        let savedPost = await post;
        Post.findOne({ title: post.title })
            .then(result => {
                if (!result) {
                    savedPost.save();
                    res.json(savedPost)
                }
            })
            .catch(err => {
                console.log(err);
            })
    } catch (err) {
        res.json({ message: err })
    }
})

// Find a specific post
router.get("/:postID", async (req, res) => {
    try {
        let requestedPost = await Post.findById(req.params.postID)
        res.json(requestedPost)
    } catch (err) {
        res.json({ message: err })
    }
})

// Delete a post
router.delete("/:postID", async (req, res) => {
    try {
         removePost = await Post.deleteOne({ _id: req.params.postID })
            .then(result => {
                if (result)
                    res.json(removePost)
            })
            .catch(err => {
                console.log(err)
            })
    } catch (err) {
        res.json({ message: err })
    }
})

// Update a post
router.patch("/:postID", async (req, res) => {
    try {
        Post.findById({ _id: req.params.postID })
            .then(result => {
                if (result) {
                    let updatedPost = Post.updateOne(
                        { _id: req.params.postID },
                        { $set: { title: req.body.title } }
                    )
                    res.json(updatedPost)
                }else{
                    res.send("Sorry")
                }
            })
            .catch(err => {
                res.send(err)
            })
    } catch (err) {
        res.json({ message: err })
    }
})

module.exports = router;