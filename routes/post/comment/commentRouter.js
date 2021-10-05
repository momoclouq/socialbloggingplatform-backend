const express = require("express");
const Post = require("../../../models/post");
const router = express.Router({mergeParams: true});

const passport = require('passport');

const controller = require("./commentController");

//route: /post/:postid/comment

router.use("/*", (req, res, next) => {
    //check if post exist
    Post.findById(req.params.id).exec((err, post) => {
        if(err) return next(err);

        if(!post) return res.status(404).json({
            error: "post does not exist"
        })
        else{
            //save post to response
            res.locals.post = post;
            next();
        }
    })
})

router.use("/:commentid", (req, res, next) => {
    //check if comment is in the post
    if(!res.locals.post.all_comments.includes(req.params.commentid)){
        return res.status(403).json({
            error: "comments does not belong to this post or the comment does not exist"
        })
    } else next();
})

router.get("/:commentid", controller.getCommentById);

router.delete("/:commentid", passport.authenticate("jwt", {session: false}), controller.deleteCommentById);

router.put("/:commentid", passport.authenticate("jwt", {session: false}), controller.putCommentById);

router.post("/", controller.postComment);

router.get("/", controller.getAllComment);

module.exports = router;