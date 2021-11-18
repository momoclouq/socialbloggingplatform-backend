const express = require('express');
const router = express.Router();

const controller = require("./postController");

const passport = require('passport');

//comment router
const commentRouter = require("./comment/commentRouter");

//route to comment
router.use("/:id/comment", commentRouter);

router.get("/personal", passport.authenticate('jwt', {session: false}), controller.getAllPersonalPost);

router.get("/published", controller.getAllPostPublished);

router.get("/published/:id", controller.getPublishedPostById);

router.get("/:id", passport.authenticate('jwt', { session: false }), controller.getPostById);

router.delete("/:id", passport.authenticate('jwt', { session: false }), controller.deletePostById);

router.put("/:id", passport.authenticate('jwt', { session: false }), controller.putPostById);

router.post("/", passport.authenticate('jwt', { session: false }), controller.postPost);

router.get("/", passport.authenticate('jwt', {session: false}), controller.getAllPost);

module.exports = router;