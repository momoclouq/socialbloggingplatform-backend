const Blogger = require("../../models/blogger");
const Post = require("../../models/post");
const {body, validationResult} = require("express-validator");
const Comment = require('../../models/comment');

const helper = require('../helper/helper');

exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id).exec(async (err, post) => {
        if(err) return next(err);

        if(!post) return res.status(404).json({
            error: "post does not exist"
        })
        else{
            return res.status(200).json({
                post: post
            })
        }
    })
}

exports.getPublishedPostById = (req, res, next) => {
    Post.findOne({ _id: req.params.id, published: true}).exec(async (err, post) => {
        if (err) return next(err);

        if(!post) return res.status(404).json({
            error: "post does not exist"
        })
        else{
            //populate author
            await Post.populate(post, {path: 'author', select: "username"});
            post.view += 1;
            await post.save();

            return res.status(200).json({
                post: post
            })
        }
    })
}

exports.deletePostById = [
    helper.checkIfPostIsFromUser,
    (req, res, next) => {
        Post.findByIdAndDelete(req.params.id).exec(async (err, oldPost) => {
            if(err) return next(err);

            if(!oldPost) return res.status(404).json({
                error: "post does not exist"
            })
            else {
                try{
                    //find the comments and delete them
                    await Promise.all(oldPost.all_comments.map(async (commentid) => {
                        return await Comment.findByIdAndDelete(commentid).exec();
                    }));
                            
                    return res.status(200).json({
                        oldPost: oldPost
                    })
                } catch(error){
                    return next(error);
                }
            }
        })
    }
]

exports.putPostById = [
    helper.checkIfPostIsFromUser,
    body("title").isLength({max: 200}).withMessage("title must be less than 200 character long"),
    body("published").optional({checkFalsy: true}).isBoolean(),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(404).json({
                error: errors.array()
            })
        }

        const update = {};
        if(req.body.title != null) update.title = req.body.title;
        if(req.body.content != null) update.content = req.body.content;
        if(req.body.published != null) update.published = req.body.published; 

        Post.findByIdAndUpdate(req.params.id, update).exec((err, post) => {
            if(err) return next(err);

            if(!post) return res.status(404).json({
                error: "Post does not exist"
            })
            else{
                return res.status(200).json({
                    post: post
                })
            }
        })
    }
]

//tested
exports.postPost = [
    body("title").exists().isString().isLength({min: 1, max: 200}).withMessage("title must be a string and has the length of maximum 200 characters"),
    body("subtitle").optional({checkFalsy: true}).isString().isLength({max: 200}).withMessage("subtitle must be less than 200 characters long"),
    body("content").exists().isString().isLength({min: 1}).withMessage("content must be not empty"),
    body("published").optional({checkFalsy: true}).isBoolean().withMessage("published status must be true/false"),
    async (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(404).json({
                error: errors.array()
            })
        }
        else{
            let author = req.user._id;

            console.log("title: " + req.body.title);

            let newPost = new Post({
                title: req.body.title,
                content: req.body.content,
                author: author,
                published: req.body.published == null ? true : req.body.published,
                subtitle: req.body.subtitle ? req.body.subtitle : ""
            })

            try{
                await newPost.save();
                return res.status(200).json({
                    post: newPost
                })
            } catch (err){
                return next(err);
            }
        }
    }
]

exports.getAllPost = (req, res, next) => {
    try{
        let page = req.query.p ? parseInt(req.query.p) : 1;

        Post.find()
        .limit(10)
        .skip(10 * (page - 1))
        .select("title subtitle author date_created published")
        .exec((err, posts) => {
            if(err) return next(err);

            if(!posts || posts.length == 0) return res.status(404).json({
                error: "posts cannot be found"
            })
            else {
                return res.status(200).json({
                    posts: posts
                })
            }
        })
    }catch(err){
        return next(err);
    }
}

exports.getAllPostPublished = async (req, res, next) => {
    try{
        let page = req.query.p ? parseInt(req.query.p) : 1;
        let mode = req.query.m ? req.query.m : "default";

        let count = await Post.countDocuments({published: true});

        let query = Post.find({published: true})
        .limit(10)
        .skip(10 * (page - 1))
        .select("title subtitle author date_created published view");

        query = helper.processModePost(query, mode);

        query.exec(async (err, posts) => {
            if(err) return next(err);

            if(!posts || posts.length == 0) return res.status(404).json({
                error: "posts cannot be found"
            })
            else {
                //find author name and url for every post
                await Post.populate(posts, { path: 'author', select: 'username'});

                return res.status(200).json({
                    posts: posts,
                    count: count
                })
            }
        })
    }catch(err){
        return next(err);
    }
}

exports.getAllPersonalPost = async (req, res, next) => {
    let page = req.query.p ? parseInt(req.query.p) : 1;
    let count = await Post.countDocuments({author: req.user._id});

    let query = Post.find({author: req.user._id})
    .limit(10)
    .skip(10 * (page - 1))
    .select("title subtitle author date_created published view");
    query = helper.processModePost(query, "latest");

    query.exec(async (err, posts) => {
        if(err) return next(err);

        if(!posts || posts.length == 0) return res.status(404).json({
            error: "posts cannot be found"
        })
        else {
            return res.status(200).json({
                posts: posts,
                count: count
            })
        }
    })
}