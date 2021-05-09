const Image = require('../models/image');
const mongoose = require('mongoose');
const user = require('../models/user');

const dbUrl = 'mongodb://localhost:27017/image-repo';
const connect = mongoose.createConnection(
    dbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

let gfs;

connect.once('open', () => {
    // initialize stream
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "photos"
    });
});


module.exports.index = async (req, res) => {
    const images = await Image.find({});


    res.render('images/index', { images })

}

module.exports.newForm = async (req, res) => {
    res.render('images/new');
}


module.exports.showImage = async (req, res) => {

    const images = await Image.find({ filename: req.params.filename });
    for (image of images) {
        //let downloadStream = gfs.openDownloadStream(image.filename);
        gfs.openDownloadStreamByName(image.filename).pipe(res);

    }

}
module.exports.uploadImage = async (req, res) => {

    let newImages = req.files.map(f => (
        new Image(
            {
                id: f._id,
                filename: f.filename,
                url: f.path,
                title: req.body.title,
                author: req.user._id
            }
        )
    )
    )
    for (let img of newImages) {
        await img.save();
    }

    res.redirect('/images');
}


module.exports.deleteImage = async (req, res) => {
    try {

        const image = await Image.findByIdAndDelete({ _id: req.params.id });
        //delete chunks with matching files._id :)
        connect.db.collection('photos.files', {}, (err, files) => {
            files.findOne({ filename: image.filename }, (err, result) => {
                let fid = result._id;
                connect.db.collection('photos.chunks', {}, (err, chunks) => {

                    chunks.deleteMany({ files_id: fid }, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500);
                        }
                    });
                });

            })


            files.deleteOne({ filename: image.filename }, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500);
                }

            });

        });


        res.redirect('/images');
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }


}

//Helper function to test if chunks and files both got deleted
const printfiles = () => {
    gfs.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No files available'
            });
        }
        console.log(files);
    });
}