angular.module('stumblefeed.services',[])
.value('USER',{})
.value('IMAGEURI',{})

.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])
.factory('Post', function($http) {
    return {
        get : function() {
            return $http.get('/upload');
        },
        post : function(todoData) {
            return $http.post('/upload', postData);
        }
    }
})
