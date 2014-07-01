App.controller('MainCtrl', function($scope, $rootScope, $log, $http, $routeParams, $location, $route, AccountsService) {

  $rootScope.currentUser = AccountsService.getCurrentUser();
  $rootScope.currentStore = AccountsService.getCurrentStore();

  $scope.pageWrapperClass = function() {
    console.log('hi');
    var test = $rootScope.currentUser ? '' : 'user-logged-out';
    console.log(test);
    return $rootScope.currentUser ? '' : 'user-logged-out';
  };

  $scope.goToSignUp = function() {
    $location.path('/signup');
  };

  $scope.login = AccountsService.login;


  $scope.changeCurrentStore = function(newStore) {
    console.log(newStore);

    AccountsService.setCurrentStore(newStore);

  };
});