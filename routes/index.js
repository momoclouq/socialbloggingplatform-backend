var express = require('express');
var router = express.Router();

//routers
const postRouter = require("./post/postRouter");
const bloggerRouter = require("./blogger/bloggerRoute");
const authRouter = require('./authRouter');

//authentication
router.use("/", authRouter);

router.use("/blogger", bloggerRouter);
router.use("/post", postRouter);

router.use("/*", (req, res, next) => {
  res.status(401).json({
    error: "Route not supported"
  })
})

module.exports = router;
