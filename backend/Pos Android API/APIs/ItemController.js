var express = require('express');
const db = require("../Repository/db");
var mongo = require('mongodb');
var router = express.Router();
var bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let moment = require('moment');

const Item = require('./Item');
const CategoryItem = require('./CategoryItem');
const itemCollection = "item";
const categoryCollection = "category";

const itemSchema = Joi.object().keys({
    name: Joi.string().required(),
    companyId: Joi.string().required(),
    category: Joi.string().allow(""),
    categoryId: Joi.string().allow(""),
    soldBy: Joi.string().required(),
    price: Joi.string().allow(""),
    cost: Joi.string().required(),
    sku: Joi.string().required(),
    barcode: Joi.string().allow(""),
    inStock: Joi.number(),
    color: Joi.string().when(
        'image' , {
            is:Joi.exist(),
            then:Joi.optional().allow(""),
            otherwise:Joi.required()
        }
    ),
    shape: Joi.string().when(
        'image' , {
            is:Joi.exist(),
            then:Joi.optional().allow(""),
            otherwise:Joi.required()
        }
    ),
    image: Joi.string().allow(""),
    type: Joi.string().required(),
    deleted: Joi.boolean(),
    itemtId: Joi.string()
});

function editItem(data, callBackFunction) {
    let resultRes = null;
    if (!data || !data.itemId) {
        resultRes = { success: false, statusCode: 400, data: err, message: "Unable to find item Id" };
        callBackFunction(true, resultRes);
    }

    // Retrieving the existing object
    let newItem = new Item();

    db.getDB().collection(itemCollection).find({ "_id": new mongo.ObjectID(data.itemId) }).toArray((err, result) => {
        if (err) {
            resultRes = { success: false, statusCode: 500, data: err, message: "Unable to find from db" };
            callBackFunction(true, resultRes);
        }
        else {
            if (result && result[0]) {
                let item = result[0];

                if (item.deleted == true) {
                    resultRes = { success: false, statusCode: 400, data: err, message: "Failed to find from db" };

                    callBackFunction(true, resultRes);
                } else {

                    newItem = result[0];

                    if (data.name && data.name !== "") {
                        newItem.name = data.name;
                    }
                    if (data.category && data.category !== "") {
                        newItem.category = data.category;
                    }
                    if (data.categoryId && data.categoryId !== "") {
                        newItem.categoryId = data.categoryId;
                    }
                    if (data.soldBy && data.soldBy !== "") {
                        newItem.soldBy = data.soldBy;
                    }
                    if (data.price && data.price !== "") {
                        newItem.price = data.price;
                    }
                    if (data.cost && data.cost !== "") {
                        newItem.cost = data.cost;
                    }
                    if (data.sku && data.sku !== "") {
                        newItem.sku = data.sku;
                    }
                    if (data.barcode && data.barcode !== "") {
                        newItem.barcode = data.barcode;
                    }
                    if (data.inStock && data.inStock !== "") {
                        newItem.inStock = data.inStock;
                    }
                    if (data.color && data.color !== "") {
                        newItem.color = data.color;
                    }
                    if (data.shape && data.shape !== "") {
                        newItem.shape = data.shape;
                    }
                    if (data.image && data.image !== "") {
                        newItem.image = data.image;
                    }
                    if (data.type && data.type !== "") {
                        newItem.type = data.type;
                    }
                    newItem.timestamp = moment().utc(false).toDate();

                    // Inserting into DB
                    db.getDB().collection(itemCollection).updateOne({ "_id": new mongo.ObjectID(data.itemId) }, { $set: newItem }, { upsert: true }, (err, result) => {
                        let resultRes = null;
                        if (err) {
                            resultRes = { success: false, statusCode: 500, data: err, message: "Invalid Request" };

                            callBackFunction(true, resultRes);
                        }
                        else {
                            resultRes = { success: true, statusCode: 201, message: "Succesfully Inserted to the DB" };
                        }
                        callBackFunction(err ? true : false, resultRes);
                    });
                }

            } else {
                resultRes = { success: false, statusCode: 404, data: err, message: "Unable to find from db" };
                callBackFunction(true, resultRes);
            }

        }

    });
}

function updateCategoryItems(data, callBackFunction) {
    db.getDB().collection(categoryCollection).find({ "_id": new mongo.ObjectID(data.categoryId) }).toArray((err, result) => {
        let resultRes = null;
        if (err) {
            resultRes = { success: false, statusCode: 500, data: err, message: "Unable to find from db" };
            callBackFunction(true, resultRes);

        } else {
            let categoryDetails = result[0];


            let categoryItem = new CategoryItem();
            categoryItem.itemId = data.itemId;
            categoryItem.itemName = data.name;
            categoryItem.price = data.price;
            categoryItem.color = data.color;
            categoryItem.shape = data.shape;


            if (categoryDetails.items) {
                if (categoryDetails.items.find(item => item.itemId == data.itemId)) {
                    let itemObj = categoryDetails.items.find(item => item.itemId == data.itemId);
                    let updatedArr = categoryDetails.items.filter(function (catItem) {
                        return catItem.itemId != itemObj.itemId
                    });
                    categoryDetails.items = updatedArr;
                    categoryDetails.items[categoryDetails.items.length] = categoryItem;
                } else {
                    categoryDetails.items[categoryDetails.items.length] = categoryItem;
                }

            } else {
                categoryDetails.items = [];
                categoryDetails.items.push(categoryItem)
            }

            db.getDB().collection(categoryCollection).updateOne({ "_id": new mongo.ObjectID(data.categoryId) }, { $set: categoryDetails }, { upsert: true }, (err, result) => {
                if (err) {
                    onsole.log("Create Connection Number:", err)
                    resultRes = { success: false, statusCode: 500, data: err, message: "Invalid Request" };

                    callBackFunction(true, resultRes);

                } else {
                    resultRes = { success: true, statusCode: 201, data: result, message: "Succesfully Inserted to the DB" };
                }
                callBackFunction(err ? true : false, resultRes);

            })
        }
    })

}

function removeCategoryItems(data, callBackFunction) {
        db.getDB().collection(categoryCollection).find({ "_id": new mongo.ObjectID(data.itemObj.categoryId) }).toArray((err, result) => {
            let resultRes = null;
            if (err) {
                resultRes = { success: false, statusCode: 500, data: err, message: "Unable to find from db" };
                callBackFunction(true, resultRes);
            } else {
                let remCatDetails = result[0];
                //remove category Item
                if (remCatDetails.items) {
                    if (remCatDetails.items.find(item => item.itemId == data.itemId)) {
                        
                        let itemObj = remCatDetails.items.find(item => item.itemId == data.itemId);
                        let updatedArr = remCatDetails.items.filter(function (catItem) {
                            return catItem.itemId != itemObj.itemId
                        });
                        remCatDetails.items = updatedArr;
                        console.log(remCatDetails.items)
                    }
                }
                db.getDB().collection(categoryCollection).updateOne({ "_id": new mongo.ObjectID(data.itemObj.categoryId) }, { $set: remCatDetails }, { upsert: true }, (err, result) => {
                    if (err) {
                        resultRes = { success: false, statusCode: 500, data: err, message: "Invalid Request" };
    
                        callBackFunction(true, resultRes);
                    } else {
                        resultRes = { success: true, statusCode: 201, data: result, message: "Succesfully UpdatedB" };
                    }
                    callBackFunction(err ? true : false, resultRes);
                })
    
            }
        })
    
}

function createItem(data , callBackFunction) {
    let resultRes = null;
    Joi.validate(data, itemSchema, function (err, value) {
        if (err) {
            const resultRes = { success: false, statusCode: 400, data: err.details, message: "Invalid Request" };
            callBackFunction(true, resultRes);
        } else {
            //console.log("request data : ", value);

            let newItem = new Item();

            newItem.name = data.name;
            newItem.companyId = data.companyId;
            newItem.category = data.category;
            newItem.categoryId = data.categoryId;
            newItem.soldBy = data.soldBy;
            newItem.price = data.price;
            newItem.cost = data.cost;
            newItem.sku = data.sku;
            newItem.barcode = data.barcode;
            newItem.inStock = data.inStock;
            newItem.color = data.color;
            newItem.shape = data.shape;
            newItem.image = data.image;
            newItem.type = data.type;
            newItem.timestamp = moment().utc(false);
            newItem.deleted = false;

            // Inserting into DB
            db.getDB().collection(itemCollection).find({ "name": data.name, "companyId": data.companyId, "deleted": false }).toArray((err, result) => {
                if (err) {
                    resultRes = { success: false, statusCode: 500, data: err, message: "Unable to find from db" };
                    callBackFunction(true, resultRes);
                } else {
                    if (result && result[0]) {
                        resultRes = { success: false, statusCode: 400, data: err, message: "Item Already Exists" };
                        callBackFunction(true, resultRes);

                    } else {
                        ////////
                        db.getDB().collection(itemCollection).insertOne(newItem, (err, result) => {
                            if (err) {
                                resultRes = { success: false, statusCode: 500, data: err, message: "Unable to find from db" };
                                callBackFunction(true, resultRes);
                            }else{
                                resultRes = { success: true, statusCode: 201, data: result.ops[0], message: "Succesfully Inserted to the DB" };
                            }
                            callBackFunction(err ? true : false, resultRes);
                        });
                    }
                }
            })
        }
    });
}

function createCategoryItem(data , callBackFunction){
    let resultRes = null;
    db.getDB().collection(categoryCollection).find({ "_id": new mongo.ObjectID(data.categoryId) }).toArray((err, result) => {
        if (err) {
            resultRes = { success: false, statusCode: 500, data: err, message: "Unable to find from db" };
                    callBackFunction(true, resultRes);

        } else {
            let categoryDetails = result[0];


            let categoryItem = new CategoryItem();
            categoryItem.itemId = data.itemId;
            categoryItem.itemName = data.name;
            categoryItem.price = data.price;
            categoryItem.color = data.color;
            categoryItem.shape = data.shape;

            if (categoryDetails.items) {
                categoryDetails.items[categoryDetails.items.length] = categoryItem
            } else {
                categoryDetails.items = [];
                categoryDetails.items.push(categoryItem)
            }

            db.getDB().collection(categoryCollection).updateOne({ "_id": new mongo.ObjectID(data.categoryId) }, { $set: categoryDetails }, { upsert: true }, (err, result) => {
                if (err) {
                    resultRes = { success: false, statusCode: 500, data: err, message: "Invalid Request" };
                    callBackFunction(true, resultRes);

                } else {
                    resultRes = { success: true, statusCode: 201, data: result, message: "Succesfully Inserted to the DB" };
                }
                callBackFunction(err ? true : false, resultRes);
            })
        }
    })
}

function deleteItem(data , callBackFunction){
    let resultRes = null;
    if (!data || !data.itemId) {
        resultRes = { success: false, statusCode: 400, data: err, message: "Unable to find item Id" };
        callBackFunction(true, resultRes);
    }

    // Retrieving the existing object
    let newItem = new Item();

    db.getDB().collection(itemCollection).find({ "_id": new mongo.ObjectID(data.itemId) }).toArray((err, result) => {
        if (err) {
            resultRes = { success: false, statusCode: 500, data: err, message: "Unable to find from db" };
            callBackFunction(true, resultRes);
        }
        else {
            if (result && result[0]) {
                let item = result[0];

                    newItem = result[0];

                    if (data.deleted && data.deleted !== "") {
                        newItem.deleted = data.deleted;
                    }
                    // Inserting into DB
                    db.getDB().collection(itemCollection).updateOne({ "_id": new mongo.ObjectID(data.itemId) }, { $set: newItem }, { upsert: true }, (err, result) => {
                        let resultRes = null;
                        if (err) {
                            resultRes = { success: false, statusCode: 500, data: err, message: "Invalid Request" };

                            callBackFunction(true, resultRes);
                        }
                        else {
                            resultRes = { success: true, statusCode: 201, message: "Succesfully Updated the flag" };
                        }
                        callBackFunction(err ? true : false, resultRes);
                    });
                

            } else {
                resultRes = { success: false, statusCode: 404, data: err, message: "Unable to find from db" };
                callBackFunction(true, resultRes);
            }

        }

    });

}

//Add new item
router.post('/addItem', (req, res) => {

    // Payload from the request
    let data = req.body;
    createItem(data , function (err , createItemResponse ) {
        if(err){
            return res.status(500).json(createItemResponse);
        }else{
            if(createItemResponse.success && createItemResponse.data.category){
                data.itemId = createItemResponse.data._id + "";
                createCategoryItem(data , function (err , createCategoryItemResponse ){
                    if(err){
                        return res.status(500).json(createItemResponse);
                    }else{
                        return res.status(createCategoryItemResponse.statusCode).json(createCategoryItemResponse);
                    }
                } )
            }else{
                return res.status(createItemResponse.statusCode).json(createItemResponse);
            }
        }
        
    })

});

router.post('/editItem', (req, res) => {

    let dataBody = req.body;

    db.getDB().collection(itemCollection).find({"_id": new mongo.ObjectID(dataBody.itemId)}).toArray((err , result)=>{
        if(err){
            return res.status(500).json({
                success: false,
                message: "failed to insert document to DB",
                document: null,
                messageDetails: err
            });
            
        }else{
            if(result && result[0]){
                let itemObj = result[0];
                dataBody.itemObj = itemObj

                editItem(dataBody , function (err , editItemResponse) {
                    if(err){
                        return res.status(500).json(editItemResponse); 
                    }else{
                        if(editItemResponse.success){
                            dataBody.categoryId = dataBody.categoryId + "";

                            updateCategoryItems(dataBody , function (err , updateItemResponse) {
                                if(err){
                                    return res.status(500).json(updateItemResponse);
                                }else{
                                    if(updateItemResponse.success){
                                        console.log("Dataaaa" , dataBody)
                                        if(dataBody.categoryId != dataBody.itemObj.categoryId){
                                            removeCategoryItems(dataBody , function (err , removeItemsResponse) {
                                                if(err){
                                                    return res.status(500).json(removeItemsResponse); 
                                                }else {
                                                    return res.status(removeItemsResponse.statusCode).json(removeItemsResponse);
                                                }
                                                
                                            })
                                        }else{
                                            return res.status(updateItemResponse.statusCode).json(updateItemResponse)
                                        }
                                        
                                    }
                                }
                                
                            })
            
                        }
                    }
                    
                })
            }

        }
    })

    
});

//Delete item
router.post('/itemDelete', (req, res) => {

    let dataBody = req.body;

    db.getDB().collection(itemCollection).find({"_id":new mongo.ObjectID(dataBody.itemId)}).toArray((err , result)=>{
        if(err){
            return res.status(500).json({
                success: false,
                message: "failed to insert document to DB",
                document: null,
                messageDetails: err
            });
            
        }else{
            if(result && result[0]){
                let itemObj = result[0];
                dataBody.itemObj = itemObj;

                deleteItem(dataBody , function(err , deleteItemResponse){
                    if(err){
                        return res.status(500).json(deleteItemResponse)
                    }else{
                        if(deleteItemResponse.success){
                            removeCategoryItems(dataBody , function (err , removeCategoryItemResponse) {
                                if(err){
                                    return res.status(500).json(removeCategoryItemResponse)
                                }else{
                                    return res.status(removeCategoryItemResponse.statusCode).json(removeCategoryItemResponse);
                                }
                            })
                        }
                    }
                })
            }
        }
    })
});


//Get item by id
router.get('/item', (req, res) => {

    // Payload from the request
    let itemId = req.query["itemId"];
    if (!itemId) {
        return res.status(400).send({ error: true, errorMessage: "cannot find item id" });
    }

    db.getDB().collection(itemCollection).find({ "_id": new mongo.ObjectID(itemId) }).toArray((err, result) => {
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


//Get all items
router.get('/items', (req, res) => {

    db.getDB().collection(itemCollection).find().toArray((err, result) => {
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

                let item = result;
                item = item.filter(res => {
                    return !res.deleted;
                });

                res.status(200).json({
                    success: true,
                    message: "successfully retrieved the documents from DB",
                    document: item,
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
