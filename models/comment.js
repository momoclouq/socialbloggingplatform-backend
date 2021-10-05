const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {type: String, maxLength: 1000, required: true},
    author: {type: String, required: true, maxLength: 200},
    date_created: {type: Date, default: Date.now}
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;

