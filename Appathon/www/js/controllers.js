angular.module('stumblefeed.controllers', [])

    .config(function($compileProvider){
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|data|local):/);
    })

    .controller('AppCtrl', function ($scope, $state, OpenFB) {

        $scope.logout = function () {
            OpenFB.logout();
            $state.go('app.login');
        };

        $scope.revokePermissions = function () {
            OpenFB.revokePermissions().then(
                function () {
                    $state.go('app.login');
                },
                function () {
                    alert('Revoke permissions failed');
                });
        };

    })

    .controller('LoginCtrl', function ($scope, $location, OpenFB) {

        $scope.facebookLogin = function () {

            OpenFB.login('email,read_stream,publish_stream').then(
                function () {
                    $location.path('/app/person/me/feed');
                },
                function () {
                    alert('OpenFB login failed');
                });
        };

    })

    .controller('CaptionCtrl', function ($scope, IMAGEURI, Post) {
        $scope.createPost = function() {

            if (!$.isEmptyObject($scope.formData)) {
                $scope.formData.image = IMAGEURI;
                Post.post($scope.formData)
                    .success(function(data) {
                        $scope.formData = {};
                        $scope.daily = data;
                    });
            }
        };
    })

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, Post,$ionicLoading, $state, Cam, IMAGEURI, Post) {

            $scope.formData = {};
            var options = {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 500,
              targetHeight: 500,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false
            };

            $scope.getPicture = function() {
            Cam.getPicture(options).then(function(imageURI) {
                // IMAGEURI = imageURI;
                // $state.go('app.caption');

                $scope.formData.image = imageURI;
                $scope.formData.text = "test";
                Post.post($scope.formData)
                    .success(function(data) {
                        $scope.formData = {};
                        $scope.items = data;
                        $scope.items = $scope.items.slice().reverse();
                    });
            }, function(err) {
              console.error(err);
            });
          };

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading feed...'
            });
        };
        $scope.hide = function(){
            $scope.loading.hide();
        };

        function loadFeed() {
        $scope.show();
          Post.get()
            .success(function(data) {
                $scope.hide();
                $scope.items = data;
                $scope.items = $scope.items.slice().reverse();
                $scope.$broadcast('scroll.refreshComplete');
            }).error(function(data) {
                $scope.hide();
                alert(data.error.message);
            });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });