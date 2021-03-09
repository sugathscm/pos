var express = require('express');
const db = require("../Repository/db");
var mongo = require('mongodb');
var router = express.Router();
var bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let moment = require('moment');

const Customer = require('./Customer');
const customerCollection = "customer";
const userCollection = "users";

const customerSchema = Joi.object().keys({
    companyId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobileNumber: Joi.string().length(10).required(),
    note: Joi.string(),
    visits: Joi.number(),
    deleted : Joi.boolean(),
    customerId : Joi.string()
});


//Add new customer
router.post('/addCustomer',(req,res)=>{

    // Payload from the request
    let data = req.body;

    Joi.validate(data, customerSchema, function (err, value) {
        if(err){
            console.log("request data invalid : ", err.details);
            return res.status(400).send({error : true, errorMessage : err.details[0].message});
        }else{
            //console.log("request data : ", value);
            db.getDB().collection(userCollection).find({"companyId":data.companyId}).toArray((err ,result)=>{
                if(err){
                    return res.status(500).json({
                        success : false,
                        message : "failed to find document from DB",
                        document : null,
                        messageDetails : err
                    });
                }else{
                    if(result && result[0]){
                        let newCustomer = new Customer();

                        newCustomer.companyId = data.companyId;
                        newCustomer.name = data.name;
                        newCustomer.email = data.email;
                        newCustomer.mobileNumber = data.mobileNumber;
                        newCustomer.note = data.note;
                        newCustomer.visits = 0;
                        newCustomer.timestamp = moment().utc(false);
                        newCustomer.deleted = false;
            
                        // Inserting into DB
                        db.getDB().collection(customerCollection).insertOne(newCustomer,(err,result)=>{
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

                    }else{
                        return res.status(404).json({
                            success : false,
                            message : "failed to find document from DB",
                            document : null,
                            messageDetails : err
                        });

                    }
                }
                
            })
        }
    });
});


//Update Customer visits
router.post('/visits',(req,res)=>{

    // Payload from the request
    let data = req.body;
    if(!data.customerId){
        return res.status(500).json({
            success : false,
            message : "No Customer",
            document : null,
        });
    }else{
        //console.log("request data : ", value);
        db.getDB().collection(customerCollection).find({"_id": new mongo.ObjectID(data.customerId)}).toArray((err ,result)=>{
            if(err){
                return res.status(500).json({
                    success : false,
                    message : "failed to find document from DB",
                    document : null,
                    messageDetails : err
                });
            }else{
                if(result && result[0]){

                    db.getDB().collection(customerCollection).findOneAndUpdate(
                        { "_id": new mongo.ObjectID(data.customerId)},
                        { $inc: { visits: 1} },
                        { new: true }, (err, doc) => {
                            if (err) {
                                return res.status(500).json({
                                    success : false,
                                    message : "failed to insert document to DB",
                                    document : null,
                                    messageDetails : err
                                });
                            } else {
                                return res.status(201).json({
                                    success : true,
                                    message : "successfully inserted document to DB",
                                    document : doc.value,
                                    messageDetails : "no error"
                                });
                
                                
                                //console.log("dddddddddd",companyQuota[0])
                            }
                        });
                }else{
                    return res.status(404).json({
                        success : false,
                        message : "failed to find document from DB",
                        document : null,
                        messageDetails : err
                    });

                }
            }
            
        })

    }    
});



//Update customer
router.post('/customerUpdate',(req,res)=>{

    // Payload from the request
    let data = req.body;
    if(!data || !data.customerId){
        return res.status(400).send({error : true, errorMessage : "cannot find customer id"});
    }

    Joi.validate(data, customerSchema, function (err, value) {
        if(err){
            console.log("request data invalid : ", err.details);
            return res.status(400).send({error : true, errorMessage : err.details[0].message});
        }else{
            console.log("request data : ", value);

            // Retrieving the existing object
            let newCustomer = new Customer();

            db.getDB().collection(customerCollection).find({ "_id" : new mongo.ObjectID(data.customerId)}).toArray((err,result)=>{
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
                        let customer = result[0];

                        if(customer.deleted == true){
                            return res.status(400).json({
                                success : false,
                                message : "failed to update. Object is flagged as deleted in DB",
                                document : null,
                                messageDetails : err
                            });
                        }else {

                            newCustomer = result[0];
                        console.log('ex case 1', newCustomer);

                        if( data.name && data.name !== ""){
                            newCustomer.name = data.name;
                        }
                        if( data.email && data.email !== ""){
                            newCustomer.email = data.email;
                        }
                        if( data.mobileNumber && data.mobileNumber !== ""){
                            newCustomer.mobileNumber = data.mobileNumber;
                        }
                        if( data.note && data.note !== ""){
                            newCustomer.note = data.note;
                        }
                        newCustomer.timestamp = moment().utc(false).toDate();

                        // Inserting into DB
                        db.getDB().collection(customerCollection).updateOne({ "_id" : new mongo.ObjectID(data.customerId)},{$set: newCustomer},{upsert: true},(err,result)=>{
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
router.post('/customerDelete',(req,res)=>{

    // Payload from the request
    let data = req.body;
    if(!data || !data.customerId || !data.deleted){
        return res.status(400).send({error : true, errorMessage : "cannot find customer id or delete flag"});
    }


    // Retrieving the existing object
    let newCustomer = new Customer();

    db.getDB().collection(customerCollection).find({ "_id" : new mongo.ObjectID(data.customerId)}).toArray((err,result)=>{
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
                newCustomer = result[0];
                console.log('ex case 1', newCustomer);

                if(data.deleted && data.deleted !== ""){
                    newCustomer.deleted = data.deleted;
                }

                // Inserting into DB
                db.getDB().collection(customerCollection).updateOne({ "_id" : new mongo.ObjectID(data.customerId)},{$set: newCustomer},{upsert: true},(err,result)=>{
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
router.get('/customer',(req,res)=>{

    // Payload from the request
    let customerId = req.query["customerId"];
    if(!customerId){
        return res.status(400).send({error : true, errorMessage : "cannot find customer id"});
    }

    db.getDB().collection(customerCollection).find({ "_id" : new mongo.ObjectID(customerId)}).toArray((err,result)=>{
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
router.get('/customers',(req,res)=>{

    db.getDB().collection(customerCollection).find().toArray((err,result)=>{
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

                let customer = result;
                customer = customer.filter( res => {
                    return !res.deleted;
                });

                res.status(200).json({
                    success : true,
                    message : "successfully retrieved the documents from DB",
                    document : customer,
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
