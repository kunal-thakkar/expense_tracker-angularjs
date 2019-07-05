var app = angular.module('app', ['ngRoute', 'ngCookies']);
app.factory('AuthInterceptor', ['$rootScope', '$q', '$window', function ($rootScope, $q, $window) {
    return {
        // Send the Authorization header with each request
        'request': function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.getItem("token")) {
                config.headers.Authorization = $window.sessionStorage.getItem("token");
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status == 404) {
                $window.location = '/';
            }
            return $q.reject(rejection);
        }
    };
}]);
app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
    $routeProvider
        .when("/", {
            templateUrl: "login.html"
        })
        .when("/dashboard", {
            templateUrl: "dashboard.html",
            authorize: true
        })
        .when("/transactions", {
            templateUrl: "transactions.html",
            authorize: true
        });
}]);
app.factory('UserService', ['AppUtil', '$window', '$location', function (AppUtil, $window, $location) {
    return {
        authUser: function(user){
            return AppUtil.deferHttpPost("/login", user).then(
                function(d){
                    $window.sessionStorage.setItem("token", user.token);
                    return d;
                }
            );
        },
        getToken: function(){
            var t = $window.sessionStorage.getItem("token") 
            return t ? t : false;
        },
        validateSession: function(){
            if($window.sessionStorage.getItem("token") == null){
                $window.location = '/';
                return;
            }
        },
        logoutUser: function(){
            $window.sessionStorage.removeItem("token");
            $location.path("/")
        }
    };
}]);
app.run(["$rootScope", "$location", "UserService", function ($rootScope, $location, UserService) {
    $rootScope.$on("$routeChangeStart", function (evt, to, from) {
        if (to.authorize === true && UserService.getToken() === false) {
            alert("Session  timeout!")
            $location.path("/")
        }
    });
}]);