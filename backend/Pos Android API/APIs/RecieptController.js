var express = require('express');
const db = require("../Repository/db");
var mongo = require('mongodb');
var router = express.Router();
var bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let moment = require('moment');

const Reciept = require('./Reciept');
const recieptCollection = "reciept";
const itemsCollection = "item";

const recieptSchema = Joi.object().keys({
    name: Joi.string().required(),
    paymentType: Joi.string().required(), 
    companyId: Joi.string().required(),
    purchasedItems: Joi.array().required(),
    total: Joi.string().required(),
    deleted : Joi.boolean(),
    recieptId : Joi.string()
});

function updateItemQuantityFromStock(data) {
    console.log("gdfhsdf", data)
    // Inserting into DB
    for(let i=0 ; i<data.length ; i++){
        console.log(":asa")
        db.getDB().collection(itemsCollection).findOneAndUpdate(
            { "_id": new mongo.ObjectID(data[i].itemId) },
            { $inc: { inStock: -data[i].quantity } },
            { new: true }, (err, doc) => {
                if (err) {
                    console.log("ERROR UPDATING AFTER MONGO ENTRY ", err);
                } else {
    
                    
                    console.log("dddddddddd",doc.value)
                }
            });

    }
    
}


//Add new reciept
router.post('/addReceipt',(req,res)=>{

    // Payload from the request
    let data = req.body;

    Joi.validate(data, recieptSchema, function (err, value) {
        if(err){
            console.log("request data invalid : ", err.details);
            return res.status(400).send({error : true, errorMessage : err.details[0].message});
        }else{
            //console.log("request data : ", value);

            let newReciept = new Reciept();

            newReciept.name = data.name;
            newReciept.paymentType = data.paymentType ;
            newReciept.companyId = data.companyId;
            newReciept.purchasedItems = data.purchasedItems;
            newReciept.total= data.total;
            newReciept.timestamp = moment().utc(false);
            newReciept.deleted = false;

            console.log("Array length",  data.purchasedItems.length)

            // Inserting into DB
            db.getDB().collection(recieptCollection).insertOne(newReciept,(err,result)=>{
                if(err){
                    return res.status(500).json({
                        success : false,
                        message : "failed to insert document to DB",
                        document : null,
                        messageDetails : err
                    });
                }
                else
                    updateItemQuantityFromStock(data.purchasedItems);
                    return res.status(201).json({
                        success : true,
                        message : "successfully inserted document to DB",
                        document : result.ops[0],
                        messageDetails : "no error"
                    });
            });
        }
    });
});


//Update reciept
router.post('/recieptDiscount',(req,res)=>{

    // Payload from the request
    let data = req.body;
    if(!data || !data.recieptId){
        return res.status(400).send({error : true, errorMessage : "cannot find reciept id"});
    }

    Joi.validate(data, recieptSchema, function (err, value) {
        if(err){
            console.log("request data invalid : ", err.details);
            return res.status(400).send({error : true, errorMessage : err.details[0].message});
        }else{
            console.log("request data : ", value);

            // Retrieving the existing object
            let newReciept = new Reciept();

            db.getDB().collection(recieptCollection).find({ "_id" : new mongo.ObjectID(data.recieptId)}).toArray((err,result)=>{
                if(err){
                    return res.status(404).json({
                        success : false,
                        message : "failed to find document in DB",
                        document : null,
                        messageDetails : err
                    });
                }
                else{
                    if(result && result[0]){
                        //console.log("existing results ", result);
                        //console.log("existing result ", result[0]);
                        let reciept = result[0];

                        if(reciept.deleted == true){
                            return res.status(400).json({
                                success : false,
                                message : "failed to update. Object is flagged as deleted in DB",
                                document : null,
                                messageDetails : err
                            });
                        }else {

                            newReciept = result[0];
                        console.log('ex case 1', newReciept);

                        if( data.name && data.name !== ""){
                            newReciept.name = data.name;
                        }
                        if( data.paymentType && data.paymentType !== ""){
                            newReciept.paymentType = data.paymentType;
                        }
                        if( data.quantity && data.quantity !== ""){
                            newReciept.quantity = data.quantity;
                        }
                        if( data.total && data.total !== ""){
                            newReciept.total = data.total;
                        }
                        newReciept.timestamp = moment().utc(false).toDate();

                        // Inserting into DB
                        db.getDB().collection(recieptCollection).updateOne({ "_id" : new mongo.ObjectID(data.recieptId)},{$set: newReciept},{upsert: true},(err,result)=>{
                            if(err){
                                return res.status(500).json({
                                    success : true,
                                    message : "failed to insert document to DB",
                                    document : null,
                                    messageDetails : err
                                });
                            }
                            else
                                return res.status(200).json({
                                    success : true,
                                    message : "successfully updated document in DB",
                                    messageDetails : "no error"
                                });
                        });}

                    }else{
                        console.log("cannot find existing result ind DB");
                        return res.status(404).json({
                            success : false,
                            message : "failed to find document in DB",
                            document : null,
                            messageDetails : err
                        });
                    }

                }

            });
        }
    });
});


//Delete reciept
router.post('/recieptDelete',(req,res)=>{

    // Payload from the request
    let data = req.body;
    if(!data || !data.recieptId || !data.deleted){
        return res.status(400).send({error : true, errorMessage : "cannot find reciept id or delete flag"});
    }


    // Retrieving the existing object
    let newReciept = new Reciept();

    db.getDB().collection(recieptCollection).find({ "_id" : new mongo.ObjectID(data.recieptId)}).toArray((err,result)=>{
        if(err){
            return res.status(404).json({
                success : false,
                message : "failed to find document in DB",
                document : null,
                messageDetails : err
            });
        }
        else{
            if(result){
                newReciept = result[0];
                console.log('ex case 1', newReciept);

                if(data.deleted && data.deleted !== ""){
                    newReciept.deleted = data.deleted;
                }

                // Inserting into DB
                db.getDB().collection(recieptCollection).updateOne({ "_id" : new mongo.ObjectID(data.recieptId)},{$set: newReciept},{upsert: true},(err,result)=>{
                    if(err){
                        return res.status(500).json({
                            success : true,
                            message : "failed to flag delete the document in DB",
                            document : null,
                            messageDetails : err
                        });
                    }
                    else
                        return res.status(200).json({
                            success : true,
                            message : "successfully changed the deleted flag of the document in DB",
                            messageDetails : "no error"
                        });
                });

            }else{
                console.log("cannot find existing result ind DB");
                return res.status(404).json({
                    success : false,
                    message : "failed to find document in DB",
                    document : null,
                    messageDetails : err
                });
            }

        }

    });

});


//Get reciept by id
router.get('/reciept',(req,res)=>{

    // Payload from the request
    let recieptId = req.query["recieptId"];
    if(!recieptId){
        return res.status(400).send({error : true, errorMessage : "cannot find reciept id"});
    }

    db.getDB().collection(recieptCollection).find({ "_id" : new mongo.ObjectID(recieptId)}).toArray((err,result)=>{
        if(err){
            res.status(404).json({
                success : false,
                message : "failed to find document in DB",
                document : null,
                messageDetails : err
            });
        }
        else{

            if(result && result[0]){

                let data = result[0];

                if (data.deleted != true) {
                    res.status(200).json({
                        success : true,
                        message : "successfully retrieved the document from DB",
                        document : result[0],
                        messageDetails : "no error"
                    });
                }else {
                    res.status(404).json({
                        success : false,
                        message : "failed to update. Object is flagged as deleted in DB",
                        document : null,
                        messageDetails : err
                    });
                }

            }else{
                res.status(404).json({
                    success : false,
                    message : "failed to find document in DB",
                    document : null,
                    messageDetails : err
                });
            }


        }
    });
});


//Get all reciepts
router.get('/reciepts',(req,res)=>{

    db.getDB().collection(recieptCollection).find().toArray((err,result)=>{
        if(err){
            res.status(404).json({
                success : false,
                message : "failed to find documents in DB",
                document : null,
                messageDetails : err
            });
        }
        else{
            if(result && result.length != 0){

                let reciept = result;
                reciept = reciept.filter( res => {
                    return !res.deleted;
                });

                res.status(200).json({
                    success : true,
                    message : "successfully retrieved the documents from DB",
                    document : reciept,
                    messageDetails : "no error"
                });

            }else{
                res.status(404).json({
                    success : false,
                    message : "failed to find documents in DB",
                    document : null,
                    messageDetails : err
                });
            }
        }
    });
});

module.exports = router;
