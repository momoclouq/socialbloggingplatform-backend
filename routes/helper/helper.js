exports.checkIfPostIsFromUser = (req, res, next) => {
    //route: post/:id
    let authorid = req.user._id.toString();

    if(authorid == req.params.id) next();
    else return res.status(403).json({
        error: "access to post not belonging to blogger"
    })
}