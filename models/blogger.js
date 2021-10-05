const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const bloggerSchema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, maxLength: 40, unique: true},
    password: {type: String, required: true, select: false},
    token: {type: String, select: false}
})

bloggerSchema.methods.isValidPassword = async function(password){
    const compare = await bcrypt.compare(password, this.password);

    return compare;
}

const Blogger = mongoose.model('blogger', bloggerSchema);
module.exports = Blogger;