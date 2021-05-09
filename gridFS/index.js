const GridFsStorage = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/image-repo',
    file: (req, file) => {
        if (file.mimetype === ('image/jpeg' || 'image/png' || 'image/jpg')) {
            return {
                bucketName: 'photos'
            };
        } else {
            return null;
        }
    }
});



module.exports = {
    storage
}