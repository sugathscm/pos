let mongoose = require('mongoose');
let CategorySchema = new mongoose.Schema({
    name:String,
    colour:String,
    items:Array,
    companyId:String,
    timestamp : Date,
    deleted : Boolean
});
mongoose.model('Category', CategorySchema);

module.exports = mongoose.model('Category');
