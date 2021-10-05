require('dotenv').config();

//passport
require('./auth/auth');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');

const DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hs9fb.mongodb.net/CoreDatabase?retryWrites=true&w=majority`;
mongoose.connect(DB)
.then(
    () => {console.log("connected to database")},
    (err) => {console.log(err);}
)


mongoose.Promise = global.Promise;

var indexRouter = require('./routes/index');

//authentication file
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
