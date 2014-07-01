App.factory('StoreService', function($rootScope, $http, $firebase, $firebaseSimpleLogin, firebaseUrl, $q, $location, UserService) {

  // current user
  var currentStore;

  // function for adding new store to GAE
  var addNewStore = function(name, user) {

    var newStore = {
      'name': name,
      'ownerKey': user.key
    };
    var deferred = $q.defer();
    // add new store to GAE
    $http.post('/rest/store', newStore).then(function(data) {
      // set user's currentStore to new store
      var newStore_added = data.data;


      // update current user's current store to the store that was just added
      UserService.setCurrentStore(newStore_added);

      // add store to user's stores
      UserService.addStore(newStore_added);

      // save currentUser to GAE
      UserService.save().then(function(data) {
        $location.path('/dashboard');
      }, function(err) {
        console.log('there was an error saving user to GAE: ' + err);
      });
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var addSupplier = function(supplier) {
    UserService.getCurrentUser().currentStore.suppliers.push(supplier);
  };

  var save = function() {
    var deferred = $q.defer();
    var params = getCurrentStore();

    console.log(params);
    $http.post('rest/store/edit', params).then(function(data) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
      console.log('there was an error saving current store');
    });
    return deferred.promise;
  };

  // function for getting current store
  var getCurrentStore = function() {
    return UserService.getCurrentUser().currentStore;
  };


  // function for getting store from GAE using key
  var getStore = function(key) {
    var deferred = $q.defer();
    var params = {key: key};
    $http.get('/rest/store', params).then(function(data) {

      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };


  return {
    getStore: getStore,
    addNewStore: addNewStore,
    addSupplier: addSupplier,
    save: save
  };

});
