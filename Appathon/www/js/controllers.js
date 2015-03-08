angular.module('stumblefeed.controllers', [])

    .config(function($compileProvider){
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
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

            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            // people can't just hold enter to keep adding the same to-do anymore
            if (!$.isEmptyObject($scope.formData)) {
                // call the create function from our service (returns a promise object)
                $scope.formData.image = IMAGEURI;
                Post.post($scope.formData)
                    // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        $scope.formData = {}; // clear the form so our user is ready to enter another
                        $scope.daily = data; // assign our new list of todos
                    });
            }
        };
    })

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, Post,$ionicLoading, $state, Camera, IMAGEURI) {

            $scope.getPicture = function() {
            Camera.getPicture().then(function(imageURI) {
                IMAGEURI = imageURI;
              $state.go('app.caption');
            }, function(err) {
              console.err(err);
            }, {
              quality: 75,
              targetWidth: 320,
              targetHeight: 320,
              saveToPhotoAlbum: true
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

        $scope.upload = function() {
            $state.go('app.share');
          }

        function loadFeed() {
        $scope.show();
          Post.get()
            .success(function(data) {
                $scope.show();
                $scope.items = data;
            }).error(function(data) {
                $scope.hide();
                alert(data.error.message);
            });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });