let mongoose = require('mongoose');
const { number } = require('@hapi/joi');
let SplitItemSchema = new mongoose.Schema({
    count: Number,
    price:String,
    paymentType: String,
    paid:Boolean,
    cardType:String,
    cardNumber:Number,   
    timestamp : Date,
    deleted : Boolean
});
mongoose.model('SplitItem', SplitItemSchema);

module.exports = mongoose.model('SplitItem');
