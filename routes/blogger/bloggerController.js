const Blogger = require("../../models/blogger");
const {body, validationResult} = require("express-validator");
const { processModeBlogger } = require("../helper/helper");
const bcrypt = require("bcrypt");
const { json } = require("express");

exports.getBloggerById = (req, res, next) => {
    Blogger.findById(req.params.id).exec((err, blogger) => {
        if(err){
            if(err.name === "CastError"){
                return res.status(404).send("blogger id is crooked");
            } 
            else return next(err);
        }

        if(!blogger) return res.status(404).json({
            error: "blogger with id: " + req.params.id +" does not exist"
        })
        else {
            return res.status(200).json({
                blogger: blogger
            })
        }
    })
}

exports.deleteBloggerCurrent = [
    body('password').exists().isString().withMessage("Password field must be filled"),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(req.body.password);

        if(!errors.isEmpty()){
            return res.status(404).json({
                error: errors.array()
            })
        }

        try{
            Blogger.findById(req.user._id).select("+password +token")
            .exec(async (err, user) => {
                if(err) return next(err);

                if(!user) return res.status(404).json({
                    error: "not authenticated"
                })
                
                const hasCorrectPass =  await user.isValidPassword(req.body.password);
                if(!hasCorrectPass){
                    return res.status(404).json({
                        error: "incorrect password for action"
                    })
                } else {
                    await Blogger.findByIdAndDelete(req.user._id);

                    return res.status(200).json({
                        message: "user deleted"
                    })
                }
            })
        } catch(err){
            return next(err);
        }
    }
]

exports.putBloggerCurrent = [
    body('password').optional({checkFalsy: true}).isString().isLength({min: 6}).withMessage("password must be at least 6 character long"),
    body("motto").optional({checkFalsy: true}).isString().isLength({max: 400}).withMessage("motto must be less than 400-character long"),
    body("oldpassword").optional({checkFalsy: true}).isString().withMessage("old password must be a string"),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(404).json({
                error: errors.array()
            })
        }

        //find the current user and compare the password
        try{
            Blogger.findById(req.user._id).select("+password +token").exec(async (err, user) => {
                if(err) return next(err);
    
                if(!user) return res.status(404).json({
                    error: "not authenticated"
                })
    
                const hasCorrectPass =  await user.isValidPassword(req.body.oldpassword);
                if(!hasCorrectPass){
                    return res.status(404).json({
                        error: "incorrect password for action"
                    })
                } else {
                    if(req.body.password){
                        const hash = await bcrypt.hash(req.body.password, 10);
                        user.password = hash;
                    }
                    if(req.body.motto) user.motto = req.body.motto;

                    await user.save();

                    return res.status(200).json({
                        newUser: user
                    })
                }
            })
        } catch(err){
            return next(err);
        }
    }
]

exports.getAllBlogger = async (req, res, next) => {
    //check if page is integer first
    let page = req.query.p ? parseInt(req.query.p) : 1;
    let mode = req.query.m ? req.query.m : "default";
    let skippedPages = 10 * (page - 1);

    let query = Blogger.find()
    .select("email username heart motto is_admin")
    .skip(skippedPages)
    .limit(10);

    let output = await processModeBlogger(query, mode);

    output.query.exec((err, bloggers) => {
        if(err) return next(err);

        if(!bloggers || bloggers.length == 0) return res.status(404).json({
            error: "cannot find any bloggers with the page number"
        })
        else {
            return res.status(200).json({
                bloggers: bloggers,
                count: output.count
            })
        }
    })
}

exports.getCurrentBlogger = (req, res, next) => {
    if(req.user){
        return res.json(req.user)
    }
    return res.status(404).json({
        error: "nothing"
    })
}

exports.heartBloggerById = (req, res, next) => {
    Blogger.findById(req.params.id).exec(async (err, blogger) => {
        if(err){
            if(err.name === "CastError"){
                return res.status(404).send("blogger id is crooked");
            } 
            else return next(err);
        }

        if(!blogger) return res.status(404).json({
            error: "blogger with id: " + id +" does not exist"
        })
        else {
            blogger.heart = blogger.heart + 1;

            try{
                await blogger.save();
                return res.status(200).json({
                    blogger: blogger
                })
            }catch (error){
                return next(error);
            }            
        }
    })
}
