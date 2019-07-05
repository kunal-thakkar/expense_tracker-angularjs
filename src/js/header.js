app.controller('HeaderController', ['$scope', 'UserService', 'AppUtil', function ($scope, UserService, AppUtil) {
    var self = this;
    self.isUserAuthenticated = function(){
        return UserService.getToken() !== false;
    };
    self.isTransactionPage = function(){
        return window.location.href.indexOf("transactions") != -1;
    };
    self.logout = function(){
        UserService.logoutUser();
    };
}]);