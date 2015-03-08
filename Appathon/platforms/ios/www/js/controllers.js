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
                        $scope.postData = {};
                        $scope.daily = data;
                    });
            }
        };
    })

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, Post, $ionicLoading, $state, Cam, IMAGEURI, Post) {

            $scope.postData = {};

            $scope.getPicture = function() {
                $scope.show();
                Cam.getPicture().then(function(imageURI) {
                $scope.postData.image = "data:image/jpeg;base64," + imageURI;
                $scope.postData.date = Date.now();
                Post.post($scope.postData)
                    .success(function(data) {
                        $scope.hide();
                        $scope.postData = {};
                        $scope.items = data.slice().reverse();
                    });
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
        $scope.show();
          Post.get()
            .success(function(data) {
                $scope.hide();
                $scope.items = data.slice().reverse();
                $scope.$broadcast('scroll.refreshComplete');
            }).error(function(data) {
                $scope.hide();
                console.error(err);
            });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });