var express = require('express');
const db = require("../Repository/db");
var mongo = require('mongodb');
var router = express.Router();
var bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let moment = require('moment');
var nodemailer = require('nodemailer');

//Add new mail
router.post('/sendMail',(req,res)=>{

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'deebitspos@gmail.com',
          pass: 'deebits123'
        }
      });

      var mailOptions = {
        from: 'deebitspos@gmail.com',
        to: 'yasirulochanaperera@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    
});


module.exports = router;