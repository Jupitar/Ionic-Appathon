// app/routes.js

// load the todo model
var User = require('./models/model.js');

// expose the routes to our app with module.exports
module.exports = function(app) {

    app.post('/upload', function (req, res){
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
      });

      form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'uploads/';

        var posts = req.posts;
            // create a todo, information comes from AJAX request from Angular
            posts.push({
                text : req.body.caption,
                path: "uploads/"+this.body.upload,
                done : false
            });

            posts.save(function (err) {
              if (err) return handleError(err)
            });

            res.json(posts);

        fs.copy(temp_path, new_location + file_name, function(err) {
          if (err) {
            console.error(err);
          } else {
            console.log("success!")
          }
        });
      });
    });

    app.get('/upload', function(req, res) {
        var posts = req.posts;
        res.json(posts); // return all posts in JSON format
    });
};