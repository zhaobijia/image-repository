const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const imagesController = require('../controllers/images')
const multer = require('multer');
const { storage } = require('../gridFS');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(imagesController.index))
    .post(upload.array('image'), catchAsync(imagesController.uploadImage));



router.get('/new', catchAsync(imagesController.newForm));

router.route('/:filename')
    .get(catchAsync(imagesController.showImage))

router.route('/:id')
    .delete(catchAsync(imagesController.deleteImage));



module.exports = router;