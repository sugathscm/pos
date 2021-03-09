var express = require('express');
const db = require("../Repository/db");
var mongo = require('mongodb');
var router = express.Router();
var bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let moment = require('moment');

const Category = require('./Category');
const categoryCollection = "category";
const usersCollection = "users";
const CategoryItem = require('./CategoryItem');


const categorySchema = Joi.object().keys({
    name: Joi.string().required(),
    colour: Joi.string().required(),
    items: Joi.array(),
    companyId: Joi.string().required(),
    deleted: Joi.boolean(),
    categoryId: Joi.string()
});

async function increaseCatCount(data) {
    db.getDB().collection(usersCollection).findOneAndUpdate(
        { "companyId": data },
        { $inc: { currentCatCount: 1 } },
        { new: true }, (err, doc) => {
            if (err) {
                console.log("ERROR UPDATING AFTER MONGO ENTRY ", err);
            } else {


                console.log("dddddddddd", doc.value)
            }
        });
    
}


//Add new category
router.post('/addCategory', (req, res) => {

    // Payload from the request
    let data = req.body;

    Joi.validate(data, categorySchema, function (err, value) {
        if (err) {
            console.log("request data invalid : ", err.details);
            return res.status(400).send({ error: true, errorMessage: err.details[0].message });
        } else {
            //console.log("request data : ", value);

            let newCategory = new Category();

            newCategory.name = data.name;
            newCategory.colour = data.colour;
            newCategory.items = data.items ? data.items : [];
            newCategory.companyId = data.companyId;
            newCategory.timestamp = moment().utc(false);
            newCategory.deleted = false;

            db.getDB().collection(usersCollection).find({"companyId":data.companyId}).toArray((err , result)=>{
                if (err) {
                    res.status(404).json({
                        success: false,
                        message: "failed to find document in DB",
                        document: null,
                        messageDetails: err
                    });
                } 
                else{
                    if(result && result[0]){
                        let companyObj = result[0];
                        if(companyObj.maximumCatCount > companyObj.currentCatCount){
                            //ok
                            db.getDB().collection(categoryCollection).find({ "name": data.name, "companyId": data.companyId , "deleted":false }).toArray((err, result) => {
                                if (err) {
                                    res.status(404).json({
                                        success: false,
                                        message: "failed to find document in DB",
                                        document: null,
                                        messageDetails: err
                                    });
                                } else {
                                    if (result && result[0]) {
                                        return res.status(200).json({
                                            success: false,
                                            message: "Category already exists",
                                            document: null,
                                            messageDetails: err
                                        });
                                    }
                                    // Inserting into DB
                                    db.getDB().collection(categoryCollection).insertOne(newCategory, (err, result) => {
                                        if (err) {
                                            return res.status(500).json({
                                                success: false,
                                                message: "failed to insert document to DB",
                                                document: null,
                                                messageDetails: err
                                            });
                                        }
                                        else
                                            increaseCatCount(data.companyId);
                                            return res.status(201).json({
                                                success: true,
                                                message: "successfully inserted document to DB",
                                                document: result.ops[0],
                                                messageDetails: "no error"
                                            });
                                    });
                                }
                            })

                        }else{
                            //not ok
                            return res.status(400).json({
                                success: false,
                                message: "Maximum category cimit exceeded",
                                document: null,
                                messageDetails: err
                            });
                        }
                    }
                }
            })


           
        }
    });
});

//Assign Item
router.post('/assignItem', (req, res) => {
    let data = req.body

    db.getDB().collection(categoryCollection).find({ "_id": new mongo.ObjectID(data.categoryId) }).toArray((err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Cannot find Category",
                document: null,
                messageDetails: err
            });

        } else {
            if (result && result[0]) {

                let categoryDetails = result[0];
                let itemsArray = [];
                let item = data.items;

                for (let i = 0; i < item.length; i++) {
                    console.log("aaaaa")

                    let categoryItem = new CategoryItem();
                    categoryItem.itemName = item[i].name;
                    categoryItem.price = item[i].price;
                    categoryItem.color = item[i].color;
                    categoryItem.shape = item[i].shape;

                    if (categoryDetails.items) {
                        console.log("sdasdasdasdsad")
                        categoryDetails.items[categoryDetails.items.length] = categoryItem
                    } else {
                        console.log("adsaidqoweqowe")
                        categoryDetails.items = [];
                        categoryDetails.items.push(categoryItem)
                    }

                }

                db.getDB().collection(categoryCollection).updateOne({ "_id": new mongo.ObjectID(data.categoryId) }, { $set: categoryDetails }, { upsert: true }, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Cannot find Category",
                            document: null,
                            messageDetails: err
                        });

                    } else {
                        return res.status(201).json({
                            success: true,
                            message: "successfully inserted document to DB",
                            document: result,
                            messageDetails: "no error"
                        });

                    }
                })

            } else {
                Joi.validate(data, categorySchema, function (err, value) {
                    if (err) {
                        console.log("request data invalid : ", err.details);
                        return res.status(400).send({ error: true, errorMessage: err.details[0].message });
                    } else {

                        let itemArr = [];
                        let item = data.items;

                        for (let i = 0; i < item.length; i++) {
            
                            let categoryItem = new CategoryItem();
                                categoryItem.itemName = item[i].name;
                                categoryItem.price = item[i].price;
                                categoryItem.color = item[i].color;
                                categoryItem.shape = item[i].shape;
            
                            itemArr.push(categoryItem);
            
                        }
            
                        let newCategory = new Category();
            
                        newCategory.name = data.name;
                        newCategory.colour = data.colour;
                        newCategory.items = itemArr;
                        newCategory.companyId = data.companyId;
                        newCategory.timestamp = moment().utc(false);
                        newCategory.deleted = false;
            
            
                        db.getDB().collection(categoryCollection).find({ "name": data.name, "companyId": data.companyId }).toArray((err, result) => {
                            if (err) {
                                res.status(404).json({
                                    success: false,
                                    message: "failed to find document in DB",
                                    document: null,
                                    messageDetails: err
                                });
                            } else {
                                if (result && result[0]) {
                                    return res.status(200).json({
                                        success: false,
                                        message: "Category already exists",
                                        document: null,
                                        messageDetails: err
                                    });
                                }
                                // Inserting into DB
                                db.getDB().collection(categoryCollection).insertOne(newCategory, (err, result) => {
                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message: "failed to insert document to DB",
                                            document: null,
                                            messageDetails: err
                                        });
                                    }
                                    else
                                        return res.status(201).json({
                                            success: true,
                                            message: "successfully inserted document to DB",
                                            document: result.ops[0],
                                            messageDetails: "no error"
                                        });
                                });
                            }
                        })
                    }
                });

            }

        }
    })

});



//Update category
router.post('/categoryUpdate', (req, res) => {

    // Payload from the request
    let data = req.body;
    if (!data || !data.categoryId) {
        return res.status(400).send({ error: true, errorMessage: "cannot find category id" });
    }


    db.getDB().collection(categoryCollection).find({ "_id": new mongo.ObjectID(data.categoryId) }).toArray((err, result) => {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "failed to find document in DB",
                document: null,
                messageDetails: err
            });
        }
        else {
            if (result && result[0]) {
                let category = result[0];

                if (category.deleted == true) {
                    return res.status(400).json({
                        success: false,
                        message: "failed to update. Object is flagged as deleted in DB",
                        document: null,
                        messageDetails: err
                    });
                } else {

                    let newCategory = result[0];
                    console.log('ex case 1', newCategory);

                    if (data.name && data.name !== "") {
                        newCategory.name = data.name;
                    }
                    if (data.colour && data.colour !== "") {
                        newCategory.colour = data.colour;
                    }

                    if (data.items && data.items.length !== 0) {
                        newCategory.items = data.items;
                    }
                    newCategory.timestamp = moment().utc(false).toDate();

                    

                    // Inserting into DB
                    db.getDB().collection(categoryCollection).updateOne({ "_id": new mongo.ObjectID(data.categoryId) }, { $set: newCategory }, { upsert: true }, (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                success: true,
                                message: "failed to insert document to DB",
                                document: null,
                                messageDetails: err
                            });
                        }
                        else
                            return res.status(200).json({
                                success: true,
                                message: "successfully updated document in DB",
                                messageDetails: "no error"
                            });
                    });
                }

            } else {
                console.log("cannot find existing result ind DB");
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


//Delete category
router.post('/categoryDelete', (req, res) => {

    // Payload from the request
    let data = req.body;
    if (!data || !data.categoryId || !data.deleted) {
        return res.status(400).send({ error: true, errorMessage: "cannot find category id or delete flag" });
    }


    // Retrieving the existing object
    let newCategory = new Category();

    db.getDB().collection(categoryCollection).find({ "_id": new mongo.ObjectID(data.categoryId) }).toArray((err, result) => {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "failed to find document in DB",
                document: null,
                messageDetails: err
            });
        }
        else {
            if (result) {
                newCategory = result[0];
                console.log('ex case 1', newCategory);

                if (data.deleted && data.deleted !== "") {
                    newCategory.deleted = data.deleted;
                }

                // Inserting into DB
                db.getDB().collection(categoryCollection).updateOne({ "_id": new mongo.ObjectID(data.categoryId) }, { $set: newCategory }, { upsert: true }, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            success: true,
                            message: "failed to flag delete the document in DB",
                            document: null,
                            messageDetails: err
                        });
                    }
                    else
                        return res.status(200).json({
                            success: true,
                            message: "successfully changed the deleted flag of the document in DB",
                            messageDetails: "no error"
                        });
                });

            } else {
                console.log("cannot find existing result ind DB");
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


//Get category by id
router.get('/category', (req, res) => {

    // Payload from the request
    let categoryId = req.query["categoryId"];
    if (!categoryId) {
        return res.status(400).send({ error: true, errorMessage: "cannot find category id" });
    }

    db.getDB().collection(categoryCollection).find({ "_id": new mongo.ObjectID(categoryId) }).toArray((err, result) => {
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


//Get all categories
router.get('/categories', (req, res) => {

    db.getDB().collection(categoryCollection).find().toArray((err, result) => {
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

                let category = result;
                category = category.filter(res => {
                    return !res.deleted;
                });

                res.status(200).json({
                    success: true,
                    message: "successfully retrieved the documents from DB",
                    document: category,
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

module.exports = router;
