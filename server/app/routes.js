var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
        text : String,
        path: String,
        done : Boolean
    });
var Posts = mongoose.model('Posts', postSchema)

// expose the routes to our app with module.exports
module.exports = function(app) {

    app.post('/upload', function(req, res) {
        var post  =  new Posts({
            text : req.body.text,
            imageURI: req.body.image,
            done : false
        });

        post.save(function (err, post) {
          if (err) return handleError(err);
          console.log("successfully posted");
        });

        res.json(post);
    });

    app.get('/upload', function(req, res) {
        console.log(Posts);
        Posts.find({}, function(err, posts) {
            res.json(posts);
        });
    });
};