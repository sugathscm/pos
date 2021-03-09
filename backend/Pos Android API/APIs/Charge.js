let mongoose = require('mongoose');
let ChargeSchema = new mongoose.Schema({
    receiptId:String,
    userId:String,
    userName:String,
    companyId:String,
    items :Array,
    splitArray : Array,
    totalPaid: String,
    totalAmount:Number,
    discountedAmount:Number,
    chargeAmount:Number,
    change:String,
    cardType:String,
    cardNmber:Number,
    email:String,
    discountNameTotBill:String,
    discountTypeTotBill:String,
    paymentType:String,
    timestamp : Date,
    deleted : Boolean
});
mongoose.model('Charge', ChargeSchema);

module.exports = mongoose.model('Charge');
