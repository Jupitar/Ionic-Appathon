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

    .controller('CaptionCtrl', function ($scope, $location, IMAGEURI, Post) {
        $scope.postData = {};

        $scope.createPost = function() {
                $scope.postData.image = IMAGEURI;
                $scope.postData.date = Date.now();
                $scope.postData.caption = $scope.formData;
                Post.post($scope.postData)
                    .success(function(data) {
                        $location.path('/app/person/me/feed');
                        console.log(data);
                    });
          };
    })

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, Post, $ionicLoading, $state, Cam, IMAGEURI, AFTERCAM, Post) {

            $scope.getPicture = function() {
                $scope.show();
                Cam.getPicture().then(function(imageURI) {
                    IMAGEURI = "data:image/jpeg;base64," + imageURI;
                    AFTERCAM = true;

            }, function(err) {
                $scope.hide();
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
            if(AFTERCAM){
                AFTERCAM = false;
                $state.go('app.caption');
            }else {
              $scope.show();
              Post.get()
                .success(function(data) {
                    $scope.hide();
                    $scope.items = data.slice().reverse();
                    $scope.$broadcast('scroll.refreshComplete');
                }).error(function(data) {
                    $scope.hide();
                    console.error(data);
                });
            }
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });