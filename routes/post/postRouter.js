const express = require('express');
const router = express.Router();

const controller = require("./postController");

const passport = require('passport');

//comment router
const commentRouter = require("./comment/commentRouter");

//route to comment
router.use("/:id/comment", commentRouter)

router.get("/:id", controller.getPostById);

router.delete("/:id", passport.authenticate('jwt', { session: false }), controller.deletePostById);

router.put("/:id", passport.authenticate('jwt', { session: false }), controller.putPostById);

router.get("/published", controller.getAllPostPublished);

router.post("/", passport.authenticate('jwt', { session: false }), controller.postPost);

router.get("/", passport.authenticate('jwt', {session: false}), controller.getAllPost);

module.exports = router;