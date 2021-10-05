const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {type: String, required: true, maxLength: 200},
    content: {type: String, required: true},
    author: {type: mongoose.Types.ObjectId, ref: 'Blogger'},
    date_created: {type: Date, default: Date.now},
    all_comments: [{type: mongoose.Types.ObjectId, ref: 'Comment'}],
    published: {type: Boolean, default: true, required: true}
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;