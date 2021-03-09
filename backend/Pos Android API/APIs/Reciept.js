let mongoose = require('mongoose');
let RecieptSchema = new mongoose.Schema({
    name:String,
    paymentType : String,
    total: String,
    companyId:String,
    purchasedItems:Array,
    timestamp : Date,
    deleted : Boolean
});
mongoose.model('Reciept', RecieptSchema);

module.exports = mongoose.model('Reciept');