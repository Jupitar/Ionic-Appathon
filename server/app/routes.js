var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
        date : Number,
        image: String,
        caption: String
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
            date: req.body.date,
            image: req.body.image,
            caption: req.body.caption
        });

        post.save(function (err, post) {
          if (err) return handleError(err);
          console.log("successfully posted");
        });

        var q = Posts.find().limit(20);
        q.exec(function(err, posts) {
            res.json(posts);
        });
    });

    app.get('/upload', function(req, res, next) {
        var q = Posts.find().limit(20);
        q.exec(function(err, posts) {
            res.json(posts);
        });
    });
};