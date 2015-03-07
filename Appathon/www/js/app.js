var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
    socket.on('event:new:image',function(data){
        socket.broadcast.emit('event:incoming:image',data);
    });
});

server.listen(8000,function(){
    console.log('Socket.io Running');
});

angular.module('stumblefeed', ['ionic', 'openfb', 'stumblefeed.controllers', 'stumblefeed.services', 'stumblefeed.directives'])

.run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB) {

        OpenFB.init('1615618795335027');

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== "app.login" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
                $state.go('app.login');
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
                controller: "AppCtrl"
            })

            .state('app.login', {
                url: "/login",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login.html",
                        controller: "LoginCtrl"
                    }
                }
            })

            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent': {
                        templateUrl: "templates/logout.html",
                        controller: "LogoutCtrl"
                    }
                }
            })

            .state('app.share', {
                url: "/share",
                views: {
                    'menuContent': {
                        templateUrl: "templates/share.html",
                        controller: "ShareCtrl"
                    }
                }
            })

            .state('chat',{
                url:'/chat',
                controller:'ChatCtrl',
                templateUrl:'templates/chat.html'
            })

            .state('app.feed', {
                url: "/person/:personId/feed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/feed.html",
                        controller: "FeedCtrl"
                    }
                }
            });

        // fallback route
        $urlRouterProvider.otherwise('/app/person/me/feed');

    });

