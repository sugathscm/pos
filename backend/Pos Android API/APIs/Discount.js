let mongoose = require('mongoose');
let DiscountSchema = new mongoose.Schema({
    name:String,
    discount:Number,
    discountType:String,
    companyId:String,
    itemId:String,
    itemName:String,
    timestamp : Date,
    deleted : Boolean
});
mongoose.model('Discount', DiscountSchema);

module.exports = mongoose.model('Discount');
