var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name : String,
    email: String,
    mobile : String,
    address : String,
    companyId : String,
    maximumCatCount: Number,
    currentCatCount: Number,
    password: String,
    language:String,
    timestamp : Date,
    deleted :Boolean
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
