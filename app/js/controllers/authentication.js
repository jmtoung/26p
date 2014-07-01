App.controller('AuthCtrl', function($scope, $rootScope, $location, firebaseUrl, $http, $q, AccountsService) {

//  $scope.currentUser = UserService.getCurrentUser();
//  $scope.$on('currentUser.update', function() {
//    $scope.currentUser = UserService.getCurrentUser();
//  });

  $scope.signUp = AccountsService.signUp;

  $scope.logout = AccountsService.logout;

  $scope.goToSignUp = function() {
    $location.path('/signup');
  };

  $scope.login = AccountsService.login;

  $scope.email = 'allviathis@gmail.com';
  $scope.password = 'asdf';

  $scope.login($scope.email, $scope.password);

});