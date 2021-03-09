let mongoose = require('mongoose');
const { Double } = require('mongodb');
let ChargeItemsSchema = new mongoose.Schema({
    itemId: String,
    itemName:String,
    quantity: Number,
    discountName:String,
    discount: Number,
    discountType:String,
    price: String,
    refunded : Boolean,    
    timestamp : Date,
    deleted : Boolean
});
mongoose.model('ChargeItems', ChargeItemsSchema);

module.exports = mongoose.model('ChargeItems');
