App.factory('InventoryService', function($http, $rootScope, $firebase, $firebaseSimpleLogin, firebaseUrl, $q, $location, AccountsService) {

  //AccountsService.queryInventory(AccountsService.getCurrentStore().key);

  // current user
  var inventory = {};

  // keep track of whether inventory has been loaded
  var loaded = {};

  // function for loading inventory for a given store
  var loadInventory = function(storeKey) {
    var deferred = $q.defer();
    var config = {
      params: {storeKey: storeKey}
    };

    $http.get('/rest/inventory', config).then(function(data) {
      console.log('successfully got inventory');
      inventory[storeKey] = data.data;
      broadcast();
      loaded[storeKey] = true;

      console.log(inventory);
      console.log(loaded);
      deferred.resolve(data.data);
    }, function(err) {
      deferred.reject(err);
      console.log('error getting inventory: ' + err)
    });
    return deferred.promise;
  };

  var getInventory = function(storeKey) {
    if (!loaded[storeKey]) {
      loadInventory(storeKey).then(function() {
        return inventory[storeKey];
      });
    } else {
      return inventory[storeKey];
    };
  };

  var addInventory = function(newInv) {

    console.log(newInv);
    var params = {
      submitter: UserService.getCurrentUser(),
      newInv: newInv
    };
    $http.post('/rest/inventory', params).then(function(data) {
      currentStoreKey = UserService.getCurrentUser().currentStore.key;
      inventory[currentStoreKey].push(data.data);
      $location.path('/dashboard');
    }, function(err) {
      console.log('error adding inventory: ' + err);
    });
  };


  return {
    getInventory: getInventory,
    addInventory: addInventory
  };

});
