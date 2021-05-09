const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const imagesController = require('../controllers/images')
const multer = require('multer');
const { storage } = require('../gridFS');
const upload = multer({ storage });
const { isLoggedIn } = require('../middleware');

router.route('/')
    .get(catchAsync(imagesController.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(imagesController.uploadImage));



router.get('/new', isLoggedIn, catchAsync(imagesController.newForm));

router.route('/:filename')
    .get(catchAsync(imagesController.showImage))

router.route('/:id')
    .delete(isLoggedIn, catchAsync(imagesController.deleteImage));



module.exports = router;