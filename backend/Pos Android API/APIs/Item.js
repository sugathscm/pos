const { string } = require('@hapi/joi');
let mongoose = require('mongoose');
let ItemSchema = new mongoose.Schema({
    name:String,
    companyId:String,
    category:String,
    categoryId:String,
    soldBy: String,
    price: String,
    cost: String,
    sku: String,
    barcode: String,
    inStock: Number,
    color: String,
    shape: String,
    image: String,
    type: String,
    timestamp : Date,
    deleted : Boolean
});
mongoose.model('Item', ItemSchema);

module.exports = mongoose.model('Item');