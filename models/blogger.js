const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const bloggerSchema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, maxLength: 40, unique: true},
    password: {type: String, required: true, select: false},
    token: {type: String, select: false},
    heart: {type: Number, default: 0, required: true},
    motto: {type: String, maxLength: 400, default: ""},
    is_admin: {type: Boolean, default: false, required: true}
})

bloggerSchema.methods.isValidPassword = async function(password){
    const compare = await bcrypt.compare(password, this.password);

    return compare;
}

const Blogger = mongoose.model('Blogger', bloggerSchema);
module.exports = Blogger;