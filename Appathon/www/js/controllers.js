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

    .controller('CaptionCtrl', function ($scope) {

    })

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, Post,$ionicLoading, $state, Camera) {

            $scope.getPicture = function() {
            Camera.getPicture().then(function(imageURI) {
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

        // function loadFeed() {
        //     $scope.show();
        //     OpenFB.get('/' + $stateParams.personId + '/home', {limit: 30})
        //         .success(function (result) {
        //             $scope.hide();
        //             $scope.items = result.data;
        //             // Used with pull-to-refresh
        //             $scope.$broadcast('scroll.refreshComplete');
        //         })
        //         .error(function(data) {
        //             $scope.hide();
        //             alert(data.error.message);
        //         });
        // }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });