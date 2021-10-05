const express = require('express');
const router = express.Router({mergeParams: true});

const passport = require('passport');

const controller = require("./bloggerController");

//get current blogger
router.get("/current", passport.authenticate("jwt", {session: false}), controller.getCurrentBlogger);

//get blogger by id
router.get("/:id", controller.getBloggerById);

router.delete("/:id", passport.authenticate("jwt", {session: false}), controller.deleteBloggerById);

router.put("/:id", passport.authenticate("jwt", {session: false}), controller.putBloggerById);

//get all blogger
router.get("/", controller.getAllBlogger);

module.exports = router;