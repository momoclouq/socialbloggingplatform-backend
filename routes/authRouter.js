const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const passport = require("passport");
const crypto = require('crypto');

const jwt = require('jsonwebtoken');

router.post("/login", 
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, blogger, info) => {
                try{
                    if(err) {
                        const error = new Error('An error occurred.');
            
                        return next(error);
                    }
                    
                    //wrong email or password
                    if(!blogger){
                        return res.status(404).json({
                            error: info.message
                        });
                    }

                    console.log(blogger);

                    //send token back to the user
                    const body = { bloggerid: blogger._id.toString(), token: blogger.token };
                    const token = jwt.sign(body, 'cutechitanda', {expiresIn: "1d"});
    
                    return res.status(200).json({ token });
                
                } catch(error){
                    return next(err);
                }
            }
        )(req, res, next);
    }
)

router.post('/signup', [
    body('username').exists().isString().isLength({min:1, max: 40}).withMessage("username must be a string and shorter than 40-character long"),
    body("email").exists().isEmail().withMessage("Email must be in correct format"),
    body("password").exists().isString().isLength({min: 6}).withMessage("password must be filled, 6 min in length"),
    body("motto").optional().isString().isLength({max: 400}).withMessage("motto must be less than 400-character long"),
    (req, res, next) => {
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(404).json({
                error: errors.array()
            })
        }
        else next();
    },
    (req, res, next) => {
        passport.authenticate("signup", {session: false}, function(err, blogger, info){
            if(err) return next(err);
            if(blogger) return res.status(200).json({
                message: "sign up successful",
            })
            else {
                return res.status(404).json({
                    error: info.message
                })
            }
        })(req, res, next);
    }
])

router.post('/logout', 
    passport.authenticate('jwt', {session: false}),
    async (req, res, next) => {
        try{
            req.user.token = crypto.randomBytes(8).toString("hex");
            await req.user.save();
    
            return res.status(200).json({
                logout: true
            })
        } catch (err){
            return next(err);
        }
    }
)

module.exports = router;