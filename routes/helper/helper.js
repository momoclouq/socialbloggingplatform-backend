const Blogger = require("../../models/blogger");
const Post = require("../../models/post");

exports.checkIfPostIsFromUser = (req, res, next) => {
    //route: post/:id
    let authorid = req.user._id.toString();

    Post.findById(req.params.id).exec((err, post) => {
        if(err) return next(err);

        if(!post) {
            return res.status(404).json({
                error: "post does not exist"
            })
        }
        else {
            if(post.author.toString() === authorid) return next();
            else return res.status(403).json({
                error: "access to post not belonging to blogger"
            })
        }
    })
}

exports.processModePost = (query, mode) => {
    switch(mode){
        case "popular":
            query = query.sort({ view: "desc" });
            break;
        case "latest":
            query = query.sort({ date_created: "desc" });
            break;
        default: break;
    }

    return query;
}

exports.processModeBlogger = async (query, mode) => {
    let output = {};

    switch(mode){
        case "popular":
            output.query = query.sort({ heart: "desc" });
            output.count = await Blogger.estimatedDocumentCount();
            break;
        case "admin":
            output.query = query.where('is_admin').equals(true);
            output.count = await Blogger.countDocuments({is_admin: true});
            break;
        default: 
            output.query = query.sort({ heart: "desc" });
            output.count = await Blogger.estimatedDocumentCount();
            break;
    }

    return output;
}