var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    username: String,
    avatar: {type: String, default: 'https://thesocietypages.org/socimages/files/2009/05/nopic_192.gif'},
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: {type: Boolean, default: false},
    password: String
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);