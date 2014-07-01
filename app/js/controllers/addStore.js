App.controller('AddStoreCtrl', function($scope, $rootScope, $http, $location, AccountsService) {

  // Get stores
  $scope.stores = AccountsService.getCurrentUser().stores;

  console.log($scope.stores);

  $scope.newStore = {};
  $scope.newStore.owner = AccountsService.getCurrentUser().key;
  $scope.newStore.admins = [AccountsService.getCurrentUser().key];
  $scope.newStore.writers = [AccountsService.getCurrentUser().key];
  $scope.newStore.viewers = [AccountsService.getCurrentUser().key];

  $scope.addStore = AccountsService.addStore;


  $scope.deleteStore = function(index) {

  };
});