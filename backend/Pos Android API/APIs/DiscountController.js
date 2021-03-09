var express = require('express');
const db = require("../Repository/db");
var mongo = require('mongodb');
var router = express.Router();
var bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let moment = require('moment');

const Discount = require('./Discount');
const discountCollection = "discount";

const discountSchema = Joi.object().keys({
    name: Joi.string().required(),
    discount: Joi.number().required(),
    discountType: Joi.string().required(),
    companyId:Joi.string().required(),
    itemId: Joi.string().required(),
    itemName: Joi.string().required(),
    deleted : Joi.boolean(),
    discountId : Joi.string()
});


//Add new discount
router.post('/addDiscount',(req,res)=>{

    // Payload from the request
    let data = req.body;

    Joi.validate(data, discountSchema, function (err, value) {
        if(err){
            console.log("request data invalid : ", err.details);
            return res.status(400).send({error : true, errorMessage : err.details[0].message});
        }else{
            //console.log("request data : ", value);

            db.getDB().collection(discountCollection).find({"itemId":data.itemId , "name" : data.name , "companyId":data.companyId , "deleted" :false}).toArray((err , result)=>{
                if(err){
                    return res.status(500).json({
                        success : false,
                        message : "failed to find document to DB",
                        document : null,
                        messageDetails : err
                    });
                }else{
                    if(result && result[0]){
                        return res.status(400).json({
                            success : false,
                            message : "Discount already exists for this item",
                            document : null,
                            messageDetails : err
                        });
                    }else{
                        let newDiscount = new Discount();

                        newDiscount.name = data.name;
                        newDiscount.discount = data.discount;
                        newDiscount.companyId = data.companyId;
                        newDiscount.discountType = data.discountType;
                        newDiscount.itemId = data.itemId;
                        newDiscount.itemName = data.itemName;
                        newDiscount.timestamp = moment().utc(false);
                        newDiscount.deleted = false;
            
                        // Inserting into DB
                        db.getDB().collection(discountCollection).insertOne(newDiscount,(err,result)=>{
                            if(err){
                                return res.status(500).json({
                                    success : false,
                                    message : "failed to insert document to DB",
                                    document : null,
                                    messageDetails : err
                                });
                            }
                            else
                                return res.status(201).json({
                                    success : true,
                                    message : "successfully inserted document to DB",
                                    document : result.ops[0],
                                    messageDetails : "no error"
                                });
                        });
                    }
                }
            })
        }
    });
});


//Update customer
router.post('/editDiscount',(req,res)=>{

    // Payload from the request
    let data = req.body;
    if(!data || !data.discountId){
        return res.status(400).send({error : true, errorMessage : "cannot find discount id"});
    }

    Joi.validate(data, discountSchema, function (err, value) {
        if(err){
            console.log("request data invalid : ", err.details);
            return res.status(400).send({error : true, errorMessage : err.details[0].message});
        }else{
            console.log("request data : ", value);


            db.getDB().collection(discountCollection).find({ "_id" : new mongo.ObjectID(data.discountId)}).toArray((err,result)=>{
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

                        if(result[0].deleted == true){
                            return res.status(400).json({
                                success : false,
                                message : "failed to update. Object is flagged as deleted in DB",
                                document : null,
                                messageDetails : err
                            });
                        }else {

                         let newDiscount = result[0];
                        console.log('ex case 1', newDiscount);

                        if( data.name && data.name !== ""){
                            newDiscount.name = data.name;
                        }
                        if( data.discount && data.discount !== ""){
                            newDiscount.discount = data.discount;
                        }
                        if( data.discountType && data.discountType !== ""){
                            newDiscount.discountType = data.discountType;
                        }
                        if( data.itemId && data.itemId !== ""){
                            newDiscount.itemId = data.itemId;
                        }
                        if( data.itemName && data.itemName !== ""){
                            newDiscount.itemName = data.itemName;
                        }
                        newDiscount.timestamp = moment().utc(false).toDate();

                        // Inserting into DB
                        db.getDB().collection(discountCollection).updateOne({ "_id" : new mongo.ObjectID(data.discountId)},{$set: newDiscount},{upsert: true},(err,result)=>{
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


//Delete customer
router.post('/discountDelete',(req,res)=>{

    // Payload from the request
    let data = req.body;
    if(!data || !data.discountId || !data.deleted){
        return res.status(400).send({error : true, errorMessage : "cannot find customer id or delete flag"});
    }


    db.getDB().collection(discountCollection).find({ "_id" : new mongo.ObjectID(data.discountId)}).toArray((err,result)=>{
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
                newDiscount = result[0];
                console.log('ex case 1', newDiscount);

                if(data.deleted && data.deleted !== ""){
                    newDiscount.deleted = data.deleted;
                }

                // Inserting into DB
                db.getDB().collection(discountCollection).updateOne({ "_id" : new mongo.ObjectID(data.discountId)},{$set: newDiscount},{upsert: true},(err,result)=>{
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


//Get customer by id
router.get('/discount',(req,res)=>{

    // Payload from the request
    let discountId = req.query["discountId"];
    if(!discountId){
        return res.status(400).send({error : true, errorMessage : "cannot find discount id"});
    }

    db.getDB().collection(discountCollection).find({ "_id" : new mongo.ObjectID(discountId)}).toArray((err,result)=>{
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


//Get all customers
router.get('/discounts',(req,res)=>{
    let itemId = req.query['itemId'];

    db.getDB().collection(discountCollection).find({"itemId": itemId}).toArray((err,result)=>{
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

                let discount = result;
                discount = discount.filter( res => {
                    return !res.deleted;
                });

                res.status(200).json({
                    success : true,
                    message : "successfully retrieved the documents from DB",
                    document : discount,
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
