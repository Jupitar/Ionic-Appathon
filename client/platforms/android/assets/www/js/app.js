angular.module('stumblefeed', ['ionic', 'openfb', 'stumblefeed.controllers', 'stumblefeed.services'])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|data|local):/);
})

.run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB) {

        OpenFB.init('1615618795335027','http://fierysolid.com/stumble/oauthcallback.html');

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
            if (toState.data.requireLogin && !$window.sessionStorage['fbtoken']) {
                $state.go('login');
                event.preventDefault();
            }
        });

        $rootScope.$on('OAuthException', function() {
            $state.go('app.login');
        });

    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: "AppCtrl",
                data: {
                    requireLogin: true
                }
            })

            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: "LoginCtrl",
                data: {
                    requireLogin: false
                }
            })

            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent': {
                        templateUrl: "templates/logout.html",
                        controller: "LogoutCtrl"
                    }
                },
                data: {
                    requireLogin: false
                }
            })

            .state('caption',{
                url:'/caption',
                templateUrl:'templates/caption.html',
                controller:'CaptionCtrl',
                data: {
                    requireLogin: false
                }
            })

            .state('app.feed', {
                url: "/feed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/feed.html",
                        controller: "FeedCtrl"
                    }
                }
            });

        // fallback route
        $urlRouterProvider.otherwise('/app/feed');

    });

