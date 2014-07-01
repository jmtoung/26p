App.controller('DashCtrl', function($scope, $rootScope, $location, UserService, storeListActiveClass, AccountsService) {

  // upon loading dashboard page, check to see if a user is logged in.
  // if user is not logged in, redirect to home

//  $scope.UserService = UserService;
//  $scope.currentUser = '';
//  $scope.inventory = '';
//  if (!UserService.getCurrentUser()) {
//    console.log('dashboard check: not logged in');
//    UserService.loginUser('jm@gmail.com','asdf').then(function() {
//      $scope.currentUser = UserService.getCurrentUser();
//      InventoryService.getInventory().then(function(data) {
//        $scope.inventory = data;
//      });
//    });
//    //$location.path('/');
//  };

//  $scope.currentUser = UserService.getCurrentUser();
//  if ($scope.currentUser) {
//      if ($scope.currentUser.currentStore) {
//          $scope.inventory = InventoryService.getInventory($scope.currentUser.currentStore.key);
//      };
//  };
//
//  $scope.$on('currentUser.update', function() {
//    $scope.currentUser = UserService.getCurrentUser();
//    if ($scope.currentUser.currentStore) {
//        $scope.inventory = InventoryService.getInventory($scope.currentUser.currentStore.key);
//    };
//  });

//  $scope.$on('inventory.update', function() {
//    $scope.inventory = InventoryService.getInventory($scope.currentUser.currentStore.key);
//  });


//  $scope.selectCurrentStore = function(user, store) {
//
//    UserService.setCurrentStore(store);
//    UserService.save();
//  };

  $scope.getStoreClass = function(store) {
    if ($scope.currentUser) {
      if (store.key == $scope.currentUser.currentStore.key) {
        return storeListActiveClass;
      };
    };
  };

  $scope.addStore = function() {
    $location.path('/addStore');
  };

  $scope.addInventory = function() {
    $location.path('/addInventory');
  };

});