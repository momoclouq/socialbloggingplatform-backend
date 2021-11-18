const { body, param, validationResult } = require("express-validator");
const Comment = require("../../../models/comment");
const helper = require('../../helper/helper');

exports.getCommentById = (req, res, next) => {
    Comment.findById(req.params.commentid).exec((err, comment) => {
        if(err) return next(err);

        if(!comment) return res.status(404).json({
            error: "comment does not exist"
        })
        else{
            return res.status(200).json({
                comment: comment
            })
        }
    })
}

// exports.getCommentsByIds = (req, res, next) => {
//     Comment.find().where('_id').in(req.body.ids)
// }

exports.deleteCommentById = [
    helper.checkIfPostIsFromUser,
    (req, res, next) => {
        Comment.findByIdAndDelete(req.params.commentid).exec(async (err, comment) => {
            if(err) return next(err);

            if(!comment) return res.status(404).json({
                error: "comment does not exist"
            })
            else {
                //remove comment from post
                let filtered = res.locals.post.all_comments.filter((commentid) => {
                    return commentid != req.params.commentid;
                })

                try{
                    res.locals.post.all_comments = filtered;
                    await res.locals.post.save();
                } catch (error){
                    return next(error);
                }
                
                return res.status(200).json({
                    comment: comment
                })
            }
        })
    }
]

exports.putCommentById = [
    helper.checkIfPostIsFromUser,
    body("content").optional().isString().isLength({max:1000}).withMessage("content must be a string with max length of 1000 characters").escape(),
    body("author").optional().isString().isLength({max: 200}).withMessage("Author can only be 200 character long max").escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(404).json({
                error: errors.array()
            })
        }
        else{
            let update = {
                content: req.body.content,
                author: req.body.author
            }
    
            Comment.findByIdAndUpdate(req.params.commentid, update).exec((err, comment) => {
                if(err) return next(err);

                if(!comment) return res.status(404).json({
                    error: "comment does not exist"
                })
                else return res.status(200).json({
                    comment: comment
                })
            })
        }
    }
]

exports.postComment = [
    body("content").exists().isString().isLength({max: 1000}).withMessage("comment content must be maximum 1000 characters long").escape(),
    body("author").exists().isString().isLength({max: 200}).withMessage("author must be 200 character long max").escape(),
    async (req, res, next) => {
        const errors = validationResult(req);

        console.log(req.body.content);
        console.log(req.body.author);

        if(!errors.isEmpty()){
            return res.status(404).json({
                error: errors.array()
            })
        } else {
            try{
                let post = res.locals.post;

                if(!post) return res.status(404).json({
                    error: "post does not exist"
                })
                else{
                    let newComment = new Comment({
                        content: req.body.content,
                        author: req.body.author
                    })
        
                    await newComment.save();
    
                    //save comment to post
                    post.all_comments.push(newComment._id);
                    await post.save();
    
                    return res.status(200).json({
                        comment: newComment
                    })
                }
            } catch(err){
                return next(err);
            }
        }
        
    }
]

exports.getAllComment = async (req, res, next) => {
    if(!res.locals.post) return res.status(404).json({
        error: "post not found"
    })

    try{
        let allComments = await Promise.all(res.locals.post.all_comments.map((id) => {
            return Comment.findById(id).exec();
        }));

        allComments = allComments.filter((comment) => {
            return comment != null;
        })

        return res.status(200).json({
            comments: allComments,
            count: allComments.length
        })
    } catch(err){
        return next(err);
    }
}