let mongoose = require('mongoose');
let CategoryItemsSchema = new mongoose.Schema({
    itemId:String,
    itemName:String,
    price: String,  
    color: String,
    shape: String,  
    timestamp : Date,
    deleted : Boolean
});
mongoose.model('CategoryItems', CategoryItemsSchema);

module.exports = mongoose.model('CategoryItems');
