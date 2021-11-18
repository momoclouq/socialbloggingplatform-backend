const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Blogger = require('../models/blogger');
const crypto = require('crypto');

//jwt
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new JWTstrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "cutechitanda",
    },
    (jwt_payload, done) => {
        Blogger.findOne({_id: jwt_payload.bloggerid}).select('+token').exec((err, blogger) => {
            if(err) return done(err, false);

            if(blogger && blogger.token == jwt_payload.token){
                return done(null, blogger);
            }
            
            else return done(null, false);
        })
    }
));

passport.use("login", new localStrategy(
    {
        usernameField: "username",
        passwordField: "password"
    },
    async (username, password, done) => {
        try{
            const blogger = await Blogger.findOne({username}).select('+password +token');

            if(!blogger) return done(null, false, {message: "blogger not found"});

            const validate = await blogger.isValidPassword(password);

            if(!validate) return done(null, false, {message: "wrong password"});
            else {
                blogger.token = crypto.randomBytes(8).toString("hex");
                await blogger.save();

                return done(null, blogger, {message: "logged in successfully"})
            }
        } catch (err){
            return done(err);
        }
    }
))

passport.use("signup", new localStrategy(
    {
        passReqToCallback: true
    },
    async (req, username, password, done) => {
        Blogger.findOne().or([{email: req.body.email}, {username: req.body.username}])
        .exec(async (err, blogger) => {
            if(err) return done(err);

            if(!blogger){
                const hash = await bcrypt.hash(req.body.password, 10);

                let newBlogger = new Blogger({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    motto: req.body.motto ? req.body.motto : ""
                })

                await newBlogger.save();

                return done(null, newBlogger);
            }
            else{
                return done(null, false, {message: "username or email already exist"})
            }
        })
    }
))

