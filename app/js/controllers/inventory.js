App.controller('InventoryCtrl', function($scope, $rootScope, $location, $filter, AccountsService) {

  AccountsService.getCurrentInventory().then(function(data) {
    $scope.inventory = data;
    $scope.postSale(0);
  }, function(err) {
    console.log(err);
  });



  $scope.postSale = function(index) {
    AccountsService.setSaleItem($scope.inventory[index]);
    //$location.path('/addSaleTransaction');
  };

  $scope.deleteItem = function(index) {
    var deletedItem = $scope.inventory.splice(index,1);
    AccountsService.deleteItem(deletedItem[0]);
    $scope.inventory[index];
  };



});