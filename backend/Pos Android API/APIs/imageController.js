var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


const multer = require('multer')

const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './images')
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}${Date.now()}${file.originalname}`)
    },
  })
const upload = multer({ storage: Storage , limits:{
  fileSize : 1024 * 1024 * 2
}})

router.post('/upload', upload.array('photo', 3), (req, res) => {
    console.log('file', req.files)
    console.log('body', req.body)
    console.log("Path" , req.hostname);
      res.status(200).json({
        success: true,
        message: "successfully Inserted the documents to DB",
        document: req.files,
        messageDetails: "no error"
    });
    
  })


module.exports = router;
