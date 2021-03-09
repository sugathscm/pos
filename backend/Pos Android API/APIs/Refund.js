let mongoose = require('mongoose');
let RefundSchema = new mongoose.Schema({
    receiptId:String,
    refundId:String,
    userId:String,
    userName:String,
    companyId:String,
    chargeId:String,
    items :Array,
    totalPaid: String,
    totalAmount:Number,
    discountedAmount:Number,
    chargeAmount:Number,
    refunded:Boolean,
    change:String,
    email:String,
    discountNameTotBill:String,
    discountTypeTotBill:String,
    paymentType:String,
    timestamp : Date,
    deleted : Boolean
});
mongoose.model('Refund', RefundSchema);

module.exports = mongoose.model('Refund');
