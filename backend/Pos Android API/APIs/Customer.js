let mongoose = require('mongoose');
let CustomerSchema = new mongoose.Schema({
    companyId:String,
    name:String,
    email:String,
    mobileNumber: String,
    note : String,
    visits:Number,
    timestamp : Date,
    deleted : Boolean
});
mongoose.model('Customer', CustomerSchema);

module.exports = mongoose.model('Customer');
