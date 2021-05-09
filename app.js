if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const multer = require('multer');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');


const MongoDBStore = require('connect-mongo');

const imageRouter = require('./routes/images');
const userRouter = require('./routes/users');
const ExpressError = require('./utils/ExpressError');

const app = express();

//mongodb connections:
const yourMongoDBUrl = process.env.DB_URL;
const dbUrl = 'mongodb://localhost:27017/image-repo';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Database connected");
});
const secret = process.env.SECRET || 'indevmodethisshouldbeabettersecret!'
const store = new MongoDBStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/images', imageRouter);
//app.use('/', userRouter);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`);
})