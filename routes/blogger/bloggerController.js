const Blogger = require("../../models/blogger");
const {body, validationResult} = require("express-validator");

exports.getBloggerById = (req, res, next) => {
    Blogger.findById(req.params.id).exec((err, blogger) => {
        if(err) return next(err);

        if(!blogger) return res.status(404).json({
            error: "blogger with id: " + id +" does not exist"
        })
        else {
            return res.status(200).json({
                blogger: blogger
            })
        }
    })
}

exports.deleteBloggerById = (req, res, next) => {
    if(req.user._id.toString() != req.params.id.toString()) return res.status(403).json({
        error: "trying to delete other account"
    })

    Blogger.findByIdAndDelete(req.params.id).exec((err, blogger) => {
        if(err) return next(err);

        if(!blogger) return res.status(404).json({
            error: "blogger not found"
        })
        else{
            return res.status(200).json({
                blogger: blogger,
                deleted: true
            })
        }
    })
}

exports.putBloggerById = [
    body('password').isLength({min: 6}).withMessage("password must be at least 6 character long"),
    async (req, res, next) => {
        if(req.user._id.toString() != req.params.id.toString()) return res.status(403).json({
            error: "trying to alter other account"
        })

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(404).json({
                error: errors.array()
            })
        }

        //encrypt the password
        try{
            const hash = await bcrypt.hash(req.body.password, 10);
            Blogger.findByIdAndUpdate(req.params.id, { password: hash}).exec((err, oldBlogger) => {
                if(err) return next(err);
                if(!oldBlogger) return res.status(404).json({
                    error: "id is not valid"
                })
                else{
                    return res.status(200).json({
                        oldBlogger: oldBlogger
                    })
                }
            })
        } catch(err) {
            return next(err);
        }
    }
]

exports.getAllBlogger = (req, res, next) => {
    //check if page is integer first
    let page = req.query.p ? parseInt(req.query.p) : 1;
    let skippedPages = 10 * (page - 1);

    Blogger.find()
    .select("email username")
    .skip(skippedPages)
    .limit(10)
    .exec((err, bloggers) => {
        if(err) return next(err);

        if(!bloggers || bloggers.length == 0) return res.status(404).json({
            error: "cannot find any bloggers with page"
        })
        else return res.status(200).json({
            bloggers: bloggers
        })
    })
}

exports.getCurrentBlogger = (req, res, next) => {
    if(req.user){
        return res.json(req.user)
    }
    return res.json({
        error: "nothing"
    })
}