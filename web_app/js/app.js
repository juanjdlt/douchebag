angular.module('douchejarApp', ['ngRoute', 'douchejarServices', 'ui.bootstrap'])
 
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      controller:'ListCtrl',
      templateUrl:'list.html'
    })
    .when('/list/:username/:userId', {
      controller:'detailViewCtrl',
      templateUrl:'detail.html'
    })
    .when('/new/user/', {
      controller:'CreateUserCtrl',
      templateUrl:'detail.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('ListCtrl', ['$rootScope', '$scope', '$filter', 'UserResource', function($rootScope, $scope, $filter, UserResource) {
    $scope.usernames = [];

    var points = 0;
    $scope.users = UserResource.query(function() {
        angular.forEach($scope.users, function(value, key){
          this.push(value.username);
          points += parseInt(value.points);
        }, $scope.usernames);

        $rootScope.total_points = points;

    });
    
    $scope.addDouche = function() {
        if($scope.new_douche_form.$error.required) {
            alert('All fields required');
            return;
        }

        var found = $filter('filter')($scope.users, {username: $scope.new_douche.username});
        if (found.length == 1) {
            var selected_user = found[0];
            var douche_user = new UserResource({
                                                user_id: selected_user.id, 
                                                the_thing: $scope.new_douche.the_thing, 
                                                douche_type: $scope.new_douche.type
                                            }); 
            douche_user.$save({}, 
                function success() {
                    selected_user.last_thing = douche_user.the_thing;
                    selected_user.points = douche_user.points;

                    $('#new_douche').modal('hide');
                    $scope.new_douche.the_thing = null;
                    $scope.new_douche.username = null;

                    $rootScope.total_points += parseInt(1 * douchejar_multiplier);
                }, function err(error) {
                    alert('Invalid data provided / Server Error. StatusCode :: ' + error.status);
                });
        } else {
            alert('Invalid username !');
        }    

    };
}]) 
.controller('CreateCtrl', function($scope, $location, $timeout) {

}) 
.controller('detailViewCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'UserResource',  
    function($rootScope, $scope, $location, $routeParams, UserResource) {

    $scope.username = $routeParams.username;    
    var total_points = 0;
    $scope.user_douchejars = UserResource.get({Id: $routeParams.userId}, function() {
        angular.forEach($scope.user_douchejars, function(value, key){
          total_points += parseInt(value.point);
        }, null);
        $scope.total_points = parseInt(total_points);
    });

    $scope.addDouche = function() {
        if($scope.new_douche_form.$error.required) {
            alert('All fields required');
            return;
        }

        var douche_user = new UserResource({
                                            user_id: $routeParams.userId, 
                                            the_thing: $scope.new_douche.the_thing, 
                                            douche_type: $scope.new_douche.type
                                        }); 
        douche_user.$save({}, 
            function success() {

                $('#new_douche').modal('hide');
                $scope.new_douche.the_thing = null;
                $scope.new_douche.username = null;

                $scope.user_douchejars.push(douche_user);

                $rootScope.total_points += parseInt(1 * window.douchejar_multiplier);
                $scope.total_points = douche_user.points;

            }, function err(error) {
                alert('Invalid data provided / Server Error. StatusCode :: ' + error.status);
            }
        );
    };

    $scope.destroy = function(douchejar_user) {
        var restResource = new UserResource();
        UserResource.delete({Id: douchejar_user.id}, function() {
            $scope.user_douchejars.splice($scope.user_douchejars.indexOf(douchejar_user), 1);
            $scope.total_points -= parseInt(douchejar_user.point);
        });
    }

}]);



/*SERVICES*/
var douchejarServices = angular.module('douchejarServices', ['ngResource']);
 
douchejarServices.factory('UserResource', ['$resource',
  function($resource){
    return $resource('http://api.douchebag.dev/douchejar/:Id', {}, {
      query: {method:'GET', params:{}, isArray:true},
      get:    {method:'GET', isArray:true},
      delete: {method:'DELETE', isArray:true},
    });
}]);

/*GLOBAL SETTINGS*/
var douchejar_multiplier = 1;