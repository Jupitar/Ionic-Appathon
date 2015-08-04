var express = require("express"),
    app = express(),
    formidable = require('formidable'),
    util = require('util')
    fs = require('fs-extra'),
    qt = require('quickthumb'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    configDB = require('./config/database.js');

mongoose.connect(configDB.url);

app.use(qt.static(__dirname + '/'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'america' }));
app.use(flash());

require('./app/routes.js')(app);
app.listen(8082);