var express = require('express');
const db = require("../Repository/db");
var router = express.Router();
var bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let moment = require('moment');
let mongo = require('mongodb');
const Customer = require('./Customer');

const discountCollection = "discount";
const categoryCollection = "category";
const itemsCollection = "item";
const chargeCollection = "charge";
const customerCollection = "customer"

router.post('/mobileSync', (req, res) => {

    let DATA = {};
    let userId = req.query["userId"];
    let companyId = req.query["companyId"];
    db.getDB().collection(discountCollection).find({"companyId":companyId ,"deleted":false}).toArray((err, result) => {
        if (err) {
            return res.status(500).json({
                success : false,
                message : "failed to find document from DB",
                document : null,
                messageDetails : err
            });
        } else {
            let Discounts = {};
            for (let i = 0; i < result.length; i++) {
                Discounts[result[i]._id] = result[i];
            }
            DATA.discounts = Discounts;
            db.getDB().collection(categoryCollection).find({ "companyId":companyId ,"deleted":false }).toArray((err, result) => {
                if (err) {
                    return res.status(500).json({
                        success : false,
                        message : "failed to find document from DB",
                        document : null,
                        messageDetails : err
                    });
                } else {
                    let Category = {};
                    for (let i = 0; i < result.length; i++) {
                        Category[result[i]._id] = result[i];
                    }
                    DATA.category = Category;
                    db.getDB().collection(itemsCollection).find({"companyId":companyId ,"deleted":false}).toArray((err , result)=>{
                        if(err){
                            return res.status(500).json({
                                success : false,
                                message : "failed to find document from DB",
                                document : null,
                                messageDetails : err
                            });
                        }else{
                            let Items = {};
                            for (let i = 0; i < result.length; i++) {
                            Items[result[i]._id] = result[i];
                            }
                            DATA.item = Items;
                            //need to be develop
                            db.getDB().collection(customerCollection).find({"companyId" : companyId , "deleted":false}).toArray((err , result)=>{
                                if(err){
                                    return res.status(500).json({
                                        success : false,
                                        message : "failed to find document from DB",
                                        document : null,
                                        messageDetails : err
                                    });
                                }else{
                                    let Customers = {};
                                    for(let i = 0; i < result.length ; i++){
                                        Customers[result[i]._id] = result[i];
                                    }
                                    DATA.customers = Customers
                                    db.getDB().collection(chargeCollection).find({"companyId":companyId ,"deleted":false}).toArray((err,result)=>{
                                        if(err){
                                            return res.status(500).json({
                                                success : false,
                                                message : "failed to find document from DB",
                                                document : null,
                                                messageDetails : err
                                            });
                                        }else{
                                            let Receipts = {}
                                            for(let i =0;i< result.length;i++){
                                                Receipts[result[i]._id] = result[i];
                                            }
                                            DATA.receipt = Receipts;
                                            res.status(200).json({
                                                success: true,
                                                document: DATA
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })  
                }
            })
        }
    })
});


module.exports = router;
