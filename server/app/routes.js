var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
        text : String,
        image: String
    });
var Posts = mongoose.model('Posts', postSchema)

module.exports = function(app) {

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.post('/upload', function(req, res, next) {
        var post  =  new Posts({
            text : req.body.text,
            image: req.body.image
        });

        post.save(function (err, post) {
          if (err) return handleError(err);
          console.log("successfully posted");
        });

        res.json(post);
    });

    app.get('/upload', function(req, res, next) {
        Posts.find({}, function(err, posts) {
            res.json(posts);
        });
    });
};