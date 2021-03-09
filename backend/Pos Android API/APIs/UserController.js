var express = require('express');
const db = require("../Repository/db");
var router = express.Router();
var bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let moment = require('moment');
let mongo = require('mongodb');
var sha256 = require('js-sha256');
const nodemailer = require('nodemailer');


const User = require('./User');
const LoginAttempt = require('./LoginAttempt');
const usersCollection = "users";
const loginAttemptsCollection = "loginAttempts";

const userSchemaNew = Joi.object().keys({
    name: Joi.string().min(3).max(40).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().length(10).required(),
    address:Joi.string().required(),
    companyId:Joi.string(),
    maximumCatCount:Joi.number(),
    currentCatCount:Joi.number(),
    language:Joi.string(),
    _id: Joi.string()
});



// Get All Users
router.get('/users', (req, res) => {

    db.getDB().collection(usersCollection).find({ "deleted": false }).toArray((err, result) => {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "failed to find documents in DB",
                document: null,
                messageDetails: err
            });
        }
        else {
            if (result && result.length != 0) {

                let users = result;
                users = users.filter(res => {
                    return !res.deleted;
                });

                return res.status(200).json({
                    success: true,
                    message: "successfully retrieved the documents from DB",
                    document: users,
                    messageDetails: "no error"
                });

            } else {
                return res.status(404).json({
                    success: false,
                    message: "failed to find documents in DB",
                    document: null,
                    messageDetails: err
                });
            }
        }
    });
});


//delete user
router.post('/userDelete', (req, res) => {

    // Payload from the request
    let data = req.body;
    if (!data || !data._id) {
        return res.status(400).send({ error: true, errorMessage: "cannot find user id or delete flag" });
    }

    let newUser = new User();

    db.getDB().collection(usersCollection).find({ "_id": new mongo.ObjectID(data._id) }).toArray((err, result) => {
        if (err) {
            res.status(404).json({
                success: false,
                message: "failed to find document in DB",
                document: null,
                messageDetails: err
            });
        }
        else {
            if (result) {
                //console.log("existing results ", result);
                //console.log("existing result ", result[0]);

                deleteUser = result[0];
                //console.log('ex case 1', newCase);

                if (typeof (data.deleted) == "boolean" && data.deleted !== "") {
                    deleteUser.deleted = data.deleted;
                }

                // Inserting into DB
                db.getDB().collection(usersCollection).updateOne({ "_id": new mongo.ObjectID(data._id) }, { $set: deleteUser }, { upsert: true }, (err, result) => {
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



//get by id
router.get('/user', (req, res) => {

    // Payload from the request
    let userId = req.query["userId"];
    if (!userId) {
        return res.status(400).send({ error: true, errorMessage: "cannot find user id" });
    }

    db.getDB().collection(usersCollection).find({ "_id": new mongo.ObjectID(userId) }).toArray((err, result) => {
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

function generatePassword() {
    var length = 6,
        charset = "23456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function generateComapnyID() {
    var length = 6,
        charset = "23456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function sendPasswordMail(password, email) {

    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "synergyit111@gmail.com",
            pass: "glyyqfsdmvqvgrlm"
        },
        tls:{rejectUnauthorized:false}
    });

    const message = {
        from: 'Synergy IT<synergyit111@gmail.com>',
        to: email,
        subject: 'Welcome to SynergyIT POS App',
        text: 'Welcome to SynergyIT POS App : Please use this password for login to the mobile app : ' + password,
    };

    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}

// Create user in MongiDB instance
router.post('/user', (req, res) => {

    // Payload from the request
    let data = req.body;
    console.log("create user API : ", data);

    Joi.validate(data, userSchemaNew, function (err, value) {
        if (err) {
            // console.log("request data invalid : ", err.details);
            return res.status(400).send({ error: true, errorMessage: err.details[0].message });
        } else {

            db.getDB().collection(usersCollection).find({ "email": data.email }).toArray((err, result) => {
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
                        return res.status(200).json({
                            success: false,
                            message: "user email already associated with an account",
                            document: null,
                            messageDetails: err
                        });
                    }
                    const companyId=generateComapnyID();
                    db.getDB().collection(usersCollection).find({"companyId":companyId}).toArray((err , result)=>{
                        if (err) {
                            res.status(500).json({
                                success: false,
                                message: "failed to find document in DB",
                                document: null,
                                messageDetails: err
                            });
                        }else{
                            if(result && result[0]){
                                return res.status(200).json({
                                    success: false,
                                    message: "CompanyId already associated with an account",
                                    document: null,
                                    messageDetails: err
                                });

                            }else{
                                let newUser = new User();
                                
                                const passwordTemp = generatePassword();
                                const passwordTempHash = sha256(passwordTemp);
                                // For Testing :
                                console.log("password ||||||||||||||| ", passwordTemp);
            
                                newUser.name = data.name;
                                newUser.email = data.email;
                                newUser.mobile = data.mobile;
                                newUser.address = data.address;
                                newUser.companyId = companyId;
                                newUser.password = passwordTempHash;
                                newUser.maximumCatCount = 10;
                                newUser.currentCatCount = 0;
                                newUser.language = "";
                                newUser.deleted = false;
                                newUser.timestamp = moment().utc(false);
            
                                db.getDB().collection(usersCollection).insertOne(newUser, (err, result) => {
                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message: "failed to insert document to DB",
                                            document: null,
                                            messageDetails: err
                                        });
                                    } else {
                                        sendPasswordMail(passwordTemp, data.email);
            
                                        return res.status(200).json({
                                            success: true,
                                            message: "User Created successfully",
                                            document: result.ops[0],
                                            messageDetails: "no error"
                                        });
                                    }
                                });
                               

                            }
                        }

                    })
                }
            });
        }
    });
});


router.post('/login', (req, res) => {

    console.log("login called..");
    // Payload from the request
    let data = req.body;

    if (!data || !data.user || !data.user.email) {
        return res.status(400).send({ error: true, errorMessage: "not enough data" });
    }

    db.getDB().collection(usersCollection).find({ "email": data.user.email }).toArray((err, result) => {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "failed to find user in the system",
                document: null,
                messageDetails: err
            });
        }
        else {
            if (result && result[0]) {

                if (result[0].password == data.user.password) {


                    console.log("passwords mathch..");
                    let loginAttempt = new LoginAttempt();
                    loginAttempt.uid = result[0]._id;
                    loginAttempt.email = result[0].email;
                    loginAttempt.timestamp = moment().utc();

                    let userObject = result[0];

                    // Inserting into DB
                    db.getDB().collection(loginAttemptsCollection).insertOne(loginAttempt, (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "failed to login, Please contact system admin",
                                document: null,
                                messageDetails: err
                            });
                        }
                        else {
                            return res.status(201).json({
                                success: true,
                                setupInformationFilled : false,
                                message: "successfully inserted user login attempt to DB",
                                document: { loginAttempt: result.ops[0], userObject: userObject },
                                messageDetails: "no error"
                            });
                        }
                    });

                } else {
                    return res.status(200).json({
                        success: false,
                        message: "Invalid username password.",
                        document: null,
                        messageDetails: "login error"
                    });
                }
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Invalid username password.",
                    document: null,
                    messageDetails: err
                });
            }
        }

    });
});

router.post('/userLanguage' , (req , res) =>{

    let data = req.body;
    if(!data.userId){
        return res.status(400).send({ error: true, errorMessage: "not enough data" }); 
    }
    db.getDB().collection(usersCollection).find({"_id" : new mongo.ObjectID(data.userId)}).toArray((err , result)=>{
        if(err){
            return res.status(404).json({
                success: false,
                message: "failed to find user in the system",
                document: null,
                messageDetails: err
            });
        }else{
            if(result && result[0]){
                let userObject = result[0];
                userObject.language = data.language;
                db.getDB().collection(usersCollection).updateOne({ "_id" : new mongo.ObjectID(data.userId)},{$set: userObject},{upsert: true},(err,result)=>{
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
                });
                

            }else{
                return res.status(404).json({
                    success: false,
                    message: "failed to find user in the system",
                    document: null,
                    messageDetails: err
                });
            }
        }
    })
})

router.post('/changePassword', (req, res) => {

    console.log("login called..");
    // Payload from the request
    let data = req.body;

    if (!data || !data.user || !data.user.userId || !data.user.password || !data.user.newPassword) {
        return res.status(400).send({ error: true, errorMessage: "not enough data" });
    }

    db.getDB().collection(usersCollection).find({ "_id": new mongo.ObjectID(data.user.userId) }).toArray((err, result) => {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "failed to find user in the system",
                document: null,
                messageDetails: err
            });
        }
        else {
            if (result && result[0]) {

                if (result[0].password == data.user.password) {


                    let userObject = result[0];
                    let newPassword = sha256(data.user.newPassword);

                    userObject.password = newPassword

                    // Inserting into DB
                    db.getDB().collection(usersCollection).updateOne({ "_id" : new mongo.ObjectID(data.user.userId)},{$set: userObject},{upsert: true},(err,result)=>{
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
                    });

                } else {
                    return res.status(200).json({
                        success: false,
                        message: "Invalid username password.",
                        document: null,
                        messageDetails: "login error"
                    });
                }
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Invalid username password.",
                    document: null,
                    messageDetails: err
                });
            }
        }

    });
});

module.exports = router;
