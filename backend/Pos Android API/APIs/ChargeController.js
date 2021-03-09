var express = require('express');
const db = require("../Repository/db");
var mongo = require('mongodb');
var router = express.Router();
var bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let moment = require('moment');
const nodemailer = require('nodemailer');

const Charge = require('./Charge');
const ChargeItem = require('./ChargeItems');
const Refund = require('./Refund');
const SplitItem = require('./SplitItem');
const { join } = require('path');
const chargesCollection = "charge";
const itemsCollection = "item";

const refundSchema = Joi.object().keys({
    receiptId: Joi.string(),
    refundId: Joi.string(),
    refunded: Joi.boolean(),
    userId: Joi.string().required(),
    chargeId:Joi.string().required(),
    userName: Joi.string().required(),
    companyId: Joi.string().required(),
    items: Joi.array(),
    totalPaid: Joi.string().required(),
    totalAmount: Joi.number().required(),
    discountNameTotBill: Joi.string().allow(""),
    discountTypeTotBill: Joi.string().allow(""),
    discountedAmount: Joi.number(),
    chargeAmount: Joi.number().required(),
    change: Joi.string().allow(""),
    email: Joi.string().allow(""),
    paymentType: Joi.string(),
    deleted: Joi.boolean(),
});

const chargeSchema = Joi.object().keys({
    receiptId: Joi.string(),
    userId: Joi.string().required(),
    userName: Joi.string().required(),
    companyId: Joi.string().required(),
    items: Joi.array(),
    splitArray: Joi.array(),
    cardType:Joi.string().allow(""),
    cardNumber:Joi.number().allow(""),
    totalPaid: Joi.string().required(),
    totalAmount: Joi.number().required(),
    discountNameTotBill: Joi.string().allow(""),
    discountTypeTotBill: Joi.string().allow(""),
    discountedAmount: Joi.number(),
    chargeAmount: Joi.number().required(),
    change: Joi.string().allow(""),
    email: Joi.string().allow(""),
    paymentType: Joi.string(),
    deleted: Joi.boolean(),
});

const chargeItemsSchema = Joi.object().keys({
    itemId: Joi.string().required(),
    itemName: Joi.string().required(),
    quantity: Joi.number(),
    price: Joi.string().allow(""),
    discountName: Joi.string().allow(""),
    discount: Joi.number(),
    discountType: Joi.string().allow(""),
    deleted: Joi.boolean(),
});

const splitItemsSchema = Joi.object().keys({
    itemId: Joi.string().required(),
    itemName: Joi.string().required(),
    quantity: Joi.number(),
    price: Joi.string().allow(""),
    discountName: Joi.string().allow(""),
    discount: Joi.number(),
    discountType: Joi.string().allow(""),
    deleted: Joi.boolean(),
});



// Get All Charges
router.get('/charges', (req, res) => {

    db.getDB().collection(chargesCollection).find().toArray((err, result) => {
        if (err) {
            res.status(404).json({
                success: false,
                message: "failed to find documents in DB",
                document: null,
                messageDetails: err
            });
        }
        else {

            if (result && result.length != 0) {

                let charge = result;
                charge = charge.filter(res => {
                    return !res.deleted;
                });

                res.status(200).json({
                    success: true,
                    message: "successfully retrieved the documents from DB",
                    document: charge,
                    messageDetails: "no error"
                });

            } else {
                res.status(404).json({
                    success: false,
                    message: "failed to find documents in DB",
                    document: null,
                    messageDetails: err
                });
            }
        }
    });
});

function updateItemQuantityFromStock(data) {
    // Inserting into DB
    for (let i = 0; i < data.length; i++) {
        console.log(":asa")
        db.getDB().collection(itemsCollection).findOneAndUpdate(
            { "_id": new mongo.ObjectID(data[i].itemId) },
            { $inc: { inStock: -data[i].quantity } },
            { new: true }, (err, doc) => {
                if (err) {
                    console.log("ERROR UPDATING AFTER MONGO ENTRY ", err);
                } else {
                    console.log("dddddddddd", doc.value)
                }
            });

    }

}

function updateItemQuantityFromStockRefund(data) {
    console.log("gdfhsdf", data)
    // Inserting into DB
    for (let i = 0; i < data.length; i++) {
        console.log(":asa")
        db.getDB().collection(itemsCollection).findOneAndUpdate(
            { "_id": new mongo.ObjectID(data[i].itemId) },
            { $inc: { inStock: data[i].quantity } },
            { new: true }, (err, doc) => {
                if (err) {
                    console.log("ERROR UPDATING AFTER MONGO ENTRY ", err);
                } else {
                    console.log("dddddddddd", doc.value)
                }
            });

    }

}

function sendreceiptMail(data, email) {

    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "synergyit111@gmail.com",
            pass: "glyyqfsdmvqvgrlm"
        },
        tls: { rejectUnauthorized: false }
    });

    const message = {
        from: 'Synergy IT<synergyit111@gmail.com>',
        to: email,
        subject: 'Receipt',
        text: 'Your Receipt Details',
        html: `<div style="background-color:black">
        <p style="color:white ; text-align:center">Name
        </p>
          <p style="color:white ; text-align:center"><font size="5">
          466.66
            </font>
        </p>
          <p style="color:white ; text-align:center">Total
        </p>
        <div>
            <p style="color:white ">Name:Owner
        </p>
         <p style="color:white ">POS:Owner
        </p>
        </div>
        
      </div>`
    };

    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}

function itemsHtml(data) {
    return data.items.map((item) => {
        return (
            `<div style="display:flex ;">
                <div style="flex:1;display:flex">
                    <p style="color:white ">${item.itemName}
                    </p>
                </div>
                <div style="flex:1;display:flex; background-color:red">
                    <p style="text-align:right; color:white ;">${item.quantity * item.price}
                    </p>
                </div>
            </div>`
        )
    })
}

function createRefund(data , callBackFunction){
    let resultRes = null
    Joi.validate(data, refundSchema, function (err, value) {
        if (err) {
            const resultRes = { success: false, statusCode: 400, data: err.details, message: "Invalid Request" };
            callBackFunction(true, resultRes);
        } else {
            let itemsArray = [];
            let item = data.items;

            for (let i = 0; i < item.length; i++) {

                let newChargeItem = new ChargeItem();

                newChargeItem.itemId = item[i].itemId;
                newChargeItem.itemName = item[i].itemName;
                newChargeItem.quantity = item[i].quantity;
                newChargeItem.price = item[i].price;
                newChargeItem.discountName = item[i].discountName;
                newChargeItem.discount = item[i].discount;
                newChargeItem.discountType = item[i].discountType;
                newChargeItem.refunded = false;
                newChargeItem.timestamp = moment().utc(false);
                newChargeItem.deleted = false;

                itemsArray.push(newChargeItem);

            }
            let refId = generateReceiptId();
            let refundId = "#-" + refId;
            let newRefund = new Refund();

            newRefund.receiptId = data.receiptId;
            newRefund.refundId = refundId;
            newRefund.refunded = true;
            newRefund.userId = data.userId;
            newRefund.userName = data.userName;
            newRefund.companyId = data.companyId;
            newRefund.chargeId = data.chargeId;
            newRefund.items = itemsArray;
            newRefund.totalPaid = data.totalPaid;
            newRefund.totalAmount = data.totalAmount;
            newRefund.discountedAmount = data.discountedAmount;
            newRefund.chargeAmount = data.chargeAmount;
            newRefund.discountNameTotBill = data.discountNameTotBill;
            newRefund.discountTypeTotBill = data.discountTypeTotBill;
            newRefund.change = data.change;
            newRefund.email = data.email;
            newRefund.paymentType = data.paymentType;
            newRefund.timestamp = moment().utc(false);
            newRefund.deleted = false;

            db.getDB().collection(chargesCollection).find({ "companyId": data.companyId, "refundId": refundId }).toArray((err, result) => {
                if (err) {
                    resultRes = { success: false, statusCode: 500, data: err, message: "Unable to find from db" };
                    callBackFunction(true, resultRes);
                } else {
                    if (result && result[0]) {
                        resultRes = { success: false, statusCode: 400, data: err, message: "Item Already Exists" };
                        callBackFunction(true, resultRes);
                    } else {
                        db.getDB().collection(chargesCollection).insertOne(newRefund, (err, result) => {
                            if (err) {
                                resultRes = { success: false, statusCode: 500, data: err, message: "Unable to find from db" };
                                callBackFunction(true, resultRes);
                            }
                            else{
                                updateItemQuantityFromStockRefund(itemsArray);
                                resultRes = { success: true, statusCode: 201, data: result.ops[0], message: "Succesfully Inserted to the DB" };
                            }
                            callBackFunction(err ? true : false , resultRes);
                           
                        });
                    }
                }
            })
        }
    })
}

function updateRefundedItems(data , callBackFunction){

    console.log("Body Data" , data)
    let resultRes = null
    db.getDB().collection(chargesCollection).find({"_id": new mongo.ObjectID(data.chargeId)}).toArray((err , result)=>{
        if(err){
            resultRes = { success: false, statusCode: 500, data: err, message: "Unable to find from db" };
            callBackFunction(true, resultRes);

        }else{
            if(result && result[0]){
                let chargeObj = result[0];
                console.log("Charge Data" ,chargeObj )
                data.items.forEach(element => {
                    if (chargeObj.items.find(item => item.itemId == element.itemId)) {
                        
                        let itemObj = chargeObj.items.find(item => item.itemId == element.itemId);
                        itemObj.refunded = true;
                    }
                });
                db.getDB().collection(chargesCollection).updateOne({ "_id": new mongo.ObjectID(data.chargeId) }, { $set: chargeObj }, { upsert: true }, (err, result) => {
                    if (err) {
                        resultRes = { success: false, statusCode: 500, data: err, message: "Invalid Request" };
    
                        callBackFunction(true, resultRes);
                    } else {
                        resultRes = { success: true, statusCode: 201, data: result, message: "Succesfully UpdatedB" };
                    }
                    callBackFunction(err ? true : false, resultRes);
                })

            }else{
                resultRes = { success: false, statusCode: 404, data: err, message: "Unable to find from db" };
                callBackFunction(true, resultRes);
            }
        }
    })
    
}

router.post('/sendReceipt', (req, res) => {

    let data = req.body
    console.log("dataaaaaa", data)



    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "deebitspos@gmail.com",
            pass: "zaqdbgvslpdbebhq"
        },
        tls: { rejectUnauthorized: false }
    });
    let items ='';
    let discounts = '';
    let discArr = [];
    let timestamp = moment().utc(false).format('MMMM Do YYYY, h:mm:ss a');

    for(let i = 0 ; i < data.items.length ; i++){
        if(data.items[i].discount){
            let totalDiscount;
            data.items[i].discountType == "Percentage" ? totalDiscount = ((data.items[i].price * data.items[i].quantity) * (data.items[i].discount / 100)) : totalDiscount = (data.items[i].discount * data.items[i].quantity) ;
            console.log("Discount" , totalDiscount)
            let discObj = {
                discountName : data.items[i].discountName,
                totDiscount : totalDiscount,
                discountType : data.items[i].discountType
            }
            discArr.push(discObj)
        }
    }

    for(let i=0 ; i < data.items.length ; i++){
        items += `
        <ul>
        <p style="color:white ">
        <span style="display: inline-block;
     width: 75%;">` + data.items[i].itemName + `</span>
     ` + (data.items[i].quantity * data.items[i].price) + `
    </p>
    <p style="color:white "> ` + data.items[i].quantity + "*" + data.items[i].price + `
            </p>
        </ul>`
    }

    for(let i=0 ; i < discArr.length ; i++){
        discounts +=
        `<ul>
        <p style="color:white ">
        <span style="display: inline-block;
     width: 75%;">` + discArr[i].discountName + `</span>
     `+ "-"  + discArr[i].totDiscount + `
    </p>
        </ul>` 
    }



    const message = {
        from: 'Deebits POS<sltdeebitsapp@hotmail.com>',
        to: data.email,
        subject: 'Receipt',
        text: 'Your Receipt Details',
        html: `<div style="background-color:black">
        <p style="color:white ; text-align:center ;">`+ data.userName+`
        </p>
          <p style="color:white ; text-align:center"><font size="5">
          `+ data.chargeAmount+`
            </font>
        </p>
        
          <p style="color:white ; text-align:center">Total
        </p>
            <p style="color:white ">Name:`+ data.userName+`
        </p>
         <p style="color:white ">POS:`+ data.companyId+`
        </p>
        ` + items +`

        ` + discounts +`

       


        <ul>
    <p style="color:white ">
        <span style="display: inline-block;
     width: 75%;">Total</span>
     ` + data.chargeAmount+ `
    </p>
    <p style="color:white ">
        <span style="display: inline-block;width:75%">` + data.paymentType + `</span>
        ` + data.chargeAmount+ `
    </p>
    </ul>

        <p style="color:white ">`+timestamp+`
    </div>`

    };

    transport.sendMail(message, function (err, info) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to send email",
                document: err,
                messageDetails: "no error"
            });
        } else {
            console.log(info);
            return res.status(201).json({
                success: true,
                message: "Email sent successfully!",
                document: info,
                messageDetails: "no error"
            });
        }
    });
});


router.post('/generatePDF' , (req , res) =>{

    let data = req.body;
    if (!data || !data.chargeId) {
        return res.status(400).send({ error: true, errorMessage: "cannot find Receipt id" });
    }

    db.getDB().collection(chargesCollection).find({ "_id": new mongo.ObjectID(data.chargeId) }).toArray((err, result) => {
        if (err) {
            res.status(404).json({
                success: false,
                message: "failed to find document in DB",
                document: null,
                messageDetails: err
            });
        }
        else {

            if (result && result[0]) {

                let data = result[0];

                if (data.deleted != true) {
                    res.status(200).json({
                        success: true,
                        message: "successfully retrieved the document from DB",
                        document: result[0],
                        messageDetails: "no error"
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: "failed to update. Object is flagged as deleted in DB",
                        document: null,
                        messageDetails: err
                    });
                }

            } else {
                res.status(404).json({
                    success: false,
                    message: "failed to find document in DB",
                    document: null,
                    messageDetails: err
                });
            }


        }
    });


});



router.get('/charge', (req, res) => {

    // Payload from the request
    let companyId = req.query["companyId"];
    if (!chargeId) {
        return res.status(400).send({ error: true, errorMessage: "cannot find charge id" });
    }

    db.getDB().collection(chargesCollection).find({ "companyID": companyId }).toArray((err, result) => {
        if (err) {
            res.status(404).json({
                success: false,
                message: "failed to find document in DB",
                document: null,
                messageDetails: err
            });
        }
        else {
            // console.log(result);
            if (result && result[0]) {

                let data = result[0];

                if (data.deleted != true) {
                    return res.status(200).json({
                        success: true,
                        message: "successfully retrieved the document from DB",
                        document: result[0],
                        messageDetails: "no error"
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "failed to update. Object is flagged as deleted in DB",
                        document: null,
                        messageDetails: err
                    });
                }

            } else {
                return res.status(404).json({
                    success: false,
                    message: "failed to find document in DB",
                    document: null,
                    messageDetails: err
                });
            }

        }
    });
});

function generateReceiptId() {
    var length = 5,
        charset = "23456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

//add new charge 
router.post('/addCharge', (req, res) => {
    let data = req.body;

    Joi.validate(data, chargeSchema, function (err, value) {
        if (err) {
            return res.status(400).send({ error: true, errorMessage: err.details[0].message });
        } else {
            let itemsArray = [];
            let splitItemArray = [];
            let item = data.items;
            let splitItem = data.splitArray ? data.splitArray : [];

            for (let i = 0; i < item.length; i++) {

                let newChargeItem = new ChargeItem();

                newChargeItem.itemId = item[i].itemId;
                newChargeItem.itemName = item[i].itemName;
                newChargeItem.quantity = item[i].quantity;
                newChargeItem.price = item[i].price;
                newChargeItem.discountName = item[i].discountName;
                newChargeItem.discount = item[i].discount;
                newChargeItem.discountType = item[i].discountType;
                newChargeItem.timestamp = moment().utc(false);
                newChargeItem.deleted = false;

                itemsArray.push(newChargeItem);

            }
            if(splitItem && splitItem.length !=0){
                for (let i = 0; i < splitItem.length; i++) {

                    let newSplitItem = new SplitItem();
    
                    newSplitItem.count = splitItem[i].count;
                    newSplitItem.price = splitItem[i].price;
                    newSplitItem.paymentType = splitItem[i].paymentType;
                    newSplitItem.paid = splitItem[i].paid;
                    newSplitItem.cardType = splitItem[i].cardType ? splitItem[i].cardType : "";
                    newSplitItem.cardNumber = splitItem[i].cardNumber ? splitItem[i].cardNumber : ""; 
                    newSplitItem.timestamp = moment().utc(false);
                    newSplitItem.deleted = false;
    
                    splitItemArray.push(newSplitItem);
    
                }
            }

            
            let recId = generateReceiptId();
            let receiptId = "#-" + recId;
            let newCharge = new Charge();

            newCharge.receiptId = receiptId;
            newCharge.userId = data.userId;
            newCharge.userName = data.userName;
            newCharge.companyId = data.companyId;
            newCharge.items = itemsArray;
            newCharge.splitArray = splitItemArray;
            newCharge.cardType = data.cardType ? data.cardType : "";
            newCharge.cardNumber = data.cardNumber ? data.cardNumber :"";
            newCharge.totalPaid = data.totalPaid;
            newCharge.totalAmount = data.totalAmount;
            newCharge.discountedAmount = data.discountedAmount;
            newCharge.chargeAmount = data.chargeAmount;
            newCharge.discountNameTotBill = data.discountNameTotBill;
            newCharge.discountTypeTotBill = data.discountTypeTotBill;
            newCharge.change = data.change;
            newCharge.email = data.email;
            newCharge.paymentType = data.paymentType;
            newCharge.timestamp = moment().utc(false);
            newCharge.deleted = false;

            db.getDB().collection(chargesCollection).find({ "companyId": data.companyId, "receiptId": receiptId }).toArray((err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: true,
                        message: "failed to find document from DB",
                        document: null,
                        messageDetails: err
                    });
                } else {
                    if (result && result[0]) {
                        return res.status(400).json({
                            success: true,
                            message: "ReceiptId associated with companyId already exists",
                            document: null,
                            messageDetails: err
                        });
                    } else {
                        db.getDB().collection(chargesCollection).insertOne(newCharge, (err, result) => {
                            if (err) {
                                return res.status(500).json({
                                    success: true,
                                    message: "failed to insert document to DB",
                                    document: null,
                                    messageDetails: err
                                });
                            }
                            else
                                updateItemQuantityFromStock(itemsArray);
                            return res.status(201).json({
                                success: true,
                                message: "successfully inserted document to DB",
                                document: result.ops[0],
                                messageDetails: "no error"
                            });
                        });
                    }
                }
            })
        }
    })

});


//add new charge 
router.post('/refund', (req, res) => {
    let data = req.body;

    createRefund(data , function(err , createRefundResponse){
        if(err){
            return res.status(500).json(createRefundResponse)
        }else{
            if(createRefundResponse.success){
                updateRefundedItems(data , function (err , updateRefundItemsResponse) {
                    if(err){
                        return res.status(500).json(updateRefundItemsResponse)
                    }else{
                        return res.status(updateRefundItemsResponse.statusCode).json(updateRefundItemsResponse);
                    }
                })
            }
        }
    })

});



module.exports = router;
