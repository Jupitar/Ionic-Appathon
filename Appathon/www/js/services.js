angular.module('stumblefeed.services',[])
.value('USER',{})
.value('IMAGEURI',"")
.value('AFTERCAM', false)

.factory('Cam', ['$q', function($q) {

  return {
    getPicture: function() {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, {
              quality: 60,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 500,
              targetHeight: 500,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              correctOrientation: true
            });

      return q.promise;
    }
  };
}])
.factory('Post', function($http) {
    return {
        get : function() {
            return $http.get('http://fierysolid.com:8082/upload');
        },
        post : function(postData) {
            return $http.post('http://fierysolid.com:8082/upload', postData);
        }
    };
});
