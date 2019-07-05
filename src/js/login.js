app.controller('LoginController', ['$location', 'UserService', function($location, LoginService){
    var self = this;
    self.user = {};
    self.authUser = function(){
        LoginService.authUser(self.user).then(
            function(d){
                if(d.token){
                    $location.path('/dashboard');
                }
                else if(d.Error){
                    alert(d.Error);
                }
            }
        )
    };

}]);