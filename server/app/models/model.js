var mongoose = require('mongoose');

// define the schema for our user model
var postSchema = mongoose.Schema({
        text : String,
        path: String,
        done : Boolean
    });