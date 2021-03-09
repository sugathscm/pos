const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const PORT = process.env.PORT || 3000;

const db = require("./Repository/db");

const app = express();


// For JSON Validation
const Joi = require('@hapi/joi');

// parses json data sent to us by the user
app.use(bodyParser.json());
app.use('/images', express.static('images'));


// Controllers

let CustomerController = require('./APIs/CustomerController');
let CategoryController = require('./APIs/CategoryController');
let DiscountController = require('./APIs/DiscountController');
let ChargerController = require('./APIs/ChargeController');
let MainController = require('./APIs/MainController');
let ItemController = require('./APIs/ItemController');
let RecieptController = require('./APIs/RecieptController');
let MailController = require('./APIs/MailController');
let UserController = require('./APIs/UserController');
let ImageController = require('./APIs/imageController');

app.use('/customers', CustomerController);
app.use('/categories', CategoryController);
app.use('/discounts',DiscountController);
app.use('/charge',ChargerController);
app.use('/main',MainController);
app.use('/item',ItemController);
app.use('/reciept',RecieptController);
app.use('/mail',MailController);
app.use('/users',UserController);
app.use('/image' , ImageController);


// serve static html file to user
app.get('/',(req,res)=>{

    // return res.status(200).send({status : "Ok"});
});

db.connect((err)=>{
    // If err unable to connect to database
    // End application
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    }
    // Successfully connected to database
    // Start up our Express Application
    // And listen for Request
    else{
        app.listen(PORT, () => console.log(`connected to database, Listening on ${ PORT }`));
    }
});

