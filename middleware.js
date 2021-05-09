const Image = require('./models/image');



module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        //store original url on session
        req.session.returnTo = (req.query._method === "DELETE" ? '/campgrounds' : req.originalUrl);
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
}



module.exports.isImageAuthor = async (req, res, next) => {
    const { filename } = req.params;
    //authorization
    const image = await Image.find({ filename: filename });
    if (!image.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/images`);
    }

    next();
}
