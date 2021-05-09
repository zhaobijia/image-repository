
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({

    filename: String,
    url: String,
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;