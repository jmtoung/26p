App.factory('AccountsService', function($http, $rootScope, $firebase, $firebaseSimpleLogin, firebaseUrl, $q, $location) {

  // ********** PRIVATE VARIABLES **********
  var currentUser;
  var currentStore;
  var inventory = {};
  var firebaseLoginObject;
  var saleItem;

  // ********** PRIVATE FUNCTIONS **********

  // METHOD FOR ADDING DATA TO GAE
  var _addData = function(url, data) {
    var deferred = $q.defer();
    $http.post(url, data).then(function(postData) {
      deferred.resolve(postData);
    }, function(err) {
      deferred.reject(err);
    })
    return deferred.promise;
  };

  // METHOD FOR QUERYING DATA FROM GAE
  var _queryData = function(url, queryParams) {
    var deferred = $q.defer();
    var config = {params: {queryParams: queryParams}};
    $http.get(url, config).then(function(data) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  // METHOD FOR GETTING DATA BY KEY
  var _getData = function(url, key) {
    var deferred = $q.defer();
    var config = {params: {}};
    $http.get(url + "/" + key, config).then(function(data) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  // METHOD FOR SAVING DATA TO GAE
  var _saveData = function(url, data) {
    var deferred = $q.defer();
    $http.post(url + "/" + data.key, data).then(function(postData) {
      deferred.resolve(postData);
    }, function(err) {
      deferred.reject(err);
    })
    return deferred.promise;
  };



  // METHOD FOR DELETING DATA FROM GAE
  var deleteData = function(url) {
    var deferred = $q.defer();
    $http.delete(url).then(function(data) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    })
    return deferred.promise;
  }

  var getTest = function(data) {
    var deferred = $q.defer();

    var filters = [{'property': 'availableQuantity', 'operator': '>', 'value': 2}]; //, {'property': 'category', 'operator': '=', 'value': 'Jewelry'}];
    //var ancestor = 'agpkZXZ-ZWNvdW50chILEgVTdG9yZRiAgICAgIDFCgw';
    var orders = {'property': 'availableQuantity', 'direction': 'DESC'};

    var queryParams = {filters: filters, orders: orders};

    var config = {params: {queryParams: queryParams}};
    $http.get('/rest/user', config).then(function(postData) {
      console.log(postData.data);
      deferred.resolve(postData);
    }, function(err) {
      deferred.reject(err);
    })
    return deferred.promise;
  };

  // MAKE FIREBASE LOGIN OBJECT
  var firebaseLoginObject = $firebaseSimpleLogin(new Firebase(firebaseUrl), function(error, user) {
    if (error) {
      console.log('error creating firebaseSimpleLogin: ' + error);
    } else if (user) {
      console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
    } else {
      console.log('User is logged out');
    }
  });



  // function for logging out user
  var logout = function() {
    setCurrentUser(null);
    firebaseLoginObject.$logout();
    $location.path('/');
  };

  // function to check if user is logged in
  var isLoggedIn = function() {
    if (currentUser) {
      return true;
    } else {
      return false;
    };
  };

  // ********** PUBLIC FUNCTIONS **********

  // >>> GET METHODS
  var getCurrentUser = function() {
    return currentUser;
  };

  var getCurrentStore = function() {
    return currentStore;
  };

  // >>> SET METHODS
  var setCurrentUser = function(user) {
    currentUser = user;
  };

  var setCurrentStore = function(store) {
    currentStore = store;
    // after setting current store in JS, need to save to GAE
    getCurrentUser().currentStore = store;
    return saveUser(getCurrentUser());
  };

  var setSaleItem = function(item) {
    saleItem = item;
    return;
  };

  // >>> REST METHODS
  var getUser = function(key) {
    return _getData('/rest/user', key);
  };

  var getStore = function(key) {
    return _getData('/rest/store', key);
  };

  var getSupplier = function(key) {
    return _getData('/rest/supplier', key);
  };

  var getPaymentMethod = function() {
    return _queryData('/rest/paymentMethod', {key: 'poo'});
  };

  var getSaleItem = function() {
    return saleItem;
  };

  var queryUser = function(queryParams) {
    return _queryData('/rest/user', queryParams);
  };

  var queryInventory = function(storeKey) {
    return _queryData('/rest/inventory', {storeKey: storeKey});
  };

  var saveUser = function(user) {
    return _saveData('/rest/user', user);
  };

  var saveStore = function(store) {
    return _saveData('/rest/store/', store);
  };

  var saveSupplier = function(supplier) {
    return _saveData('/rest/supplier/', supplier);
  };

  // >>> ADD METHODS: ADDING DATA TO GAE
  var addUser = function(user) {
    return _addData('/rest/user', user);
  };

  var getCurrentInventory = function() {
    var deferred = $q.defer();

    var storeKey = currentStore.key;
    if (typeof storeKey === "undefined") {
      throw "undefined key for currentStore";
    }
    if (storeKey in inventory) {
      console.log('inventory for store already defined...just load');
      deferred.resolve(inventory[storeKey]);
    } else {
      console.log('inventory for store not defined, querying inventory: ' + storeKey);
      queryInventory(storeKey).then(function(data) {
        inventory[storeKey] = data.data;
        deferred.resolve(inventory[storeKey]);
      }, function(err) {
        deferred.reject(err);
        console.log(err);
      });
    }
    return deferred.promise;
  };


  var addStore = function(store) {
    _addData('/rest/store', store).then(function(data) {
      setCurrentStore(data.data);
      getCurrentUser().stores.push(data.data);
      saveUser(getCurrentUser()).then(function(data) {
        $location.path('/dashboard');
      }, function(err) {
        console.log(err);
      });
    }, function(err) {
      console.log(err);
    });
  };

  var addSupplier = function(supplier) {
    _addData('/rest/supplier', supplier).then(function(data) {
      getCurrentStore().suppliers.push(data.data);
      getCurrentStore().lastSupplier = data.data;
      saveStore(getCurrentStore()).then(function(data) {
        $location.path('/dashboard');
      }, function(err) {
        console.log(err);
      });
    }, function(err) {
      console.log(err)
    });
  };

  var addPurchaser = function(purchaser) {
    _addData('/rest/purchaser', purchaser).then(function(data) {
      console.log(data);
      console.log(getCurrentStore());
      getCurrentStore().purchasers.push(data.data);
      getCurrentStore().lastPurchaser = data.data;
      saveStore(getCurrentStore()).then(function(data) {
        $location.path('/dashboard');
      }, function(err) {
        console.log(err);
      });
    }, function(err) {
      console.log(err)
    });
  };

  var addPaymentMethod = function(paymentMethod) {
    _addData('/rest/paymentMethod', paymentMethod).then(function(data) {
      getCurrentStore().paymentMethods.push(data.data);
      getCurrentStore().lastPaymentMethod = data.data;
      saveStore(getCurrentStore()).then(function(data) {
        $location.path('/dashboard');
      }, function(err) {
        console.log(err);
      });
    }, function(err) {
      console.log(err);
    });
  };

  var addInventory = function(inventory, items) {
    var data = {inventory: inventory, items: items};
    _addData('/rest/inventory', data).then(function(data) {
      console.log(data.data);
    }, function(err) {
      console.log(err);
    });
  };

  var addSaleTransaction = function(saleTrans) {
    _addData('/rest/saleTransaction', saleTrans).then(function(data) {
      console.log(data.data);
    }, function(err) {
      console.log(err);
    });
  };

  var deleteItem = function(item) {
    console.log(item);
    deleteData('/rest/inventory/' + item.key).then(function(data) {
      console.log(data);
    }, function(err) {
      console.log(err);
    });
  };

  // SIGNUP METHOD
  var signUp = function(email, password) {
    console.log(email)
    firebaseLoginObject.$createUser(email, password).then(function (data) {
      // upon successful creation of firebase account, make a User entity on GAE
      var newUser = {
        'email': email,
        'firebaseUid': data.uid,
        'firebaseId': data.id
      };
      console.log(newUser);
      addUser(newUser).then(function(data) {
        login(email, password, false);
      });
    }, function(err) {
      console.log(err);
    });
  };

  // LOGIN METHOD
  var login = function(email, password, rememberMe) {
    var deferred = $q.defer();
    firebaseLoginObject.$login('password', {
      email: email,
      password: password,
      rememberMe: rememberMe
    }).then(function(data) {
      // upon successful log in to firebase, pull User entity from GAE and set it to the currentUser
      queryUser({filters: [{'property': 'firebaseUid', 'operator': '=', 'value': data.uid}]}).then(function(postData) {
        if (postData.data.length != 1) {
          throw "Query user by firebaseUid should only have 1 result. Received " + postData.data.length + " results";
        }
        setCurrentUser(postData.data[0]);
        if (getCurrentUser().currentStore) {
          getStore(getCurrentUser().currentStore.key).then(function(postData) {
            setCurrentStore(postData.data);
            $location.path('/stores');
          });
        } else {
          $location.path('/dashboard');
        }
        deferred.resolve();
      }, function(err) {
        console.log('there was an error getting user: ' + err);
      });
    });
    return deferred.promise;
  };




  return {
    addUser: addUser,
    addStore: addStore,
    addSupplier: addSupplier,
    addPurchaser: addPurchaser,
    addPaymentMethod: addPaymentMethod,
    addInventory: addInventory,
    addSaleTransaction: addSaleTransaction,

    signUp: signUp,
    login: login,
    logout: logout,

    getCurrentUser: getCurrentUser,
    getCurrentStore: getCurrentStore,
    getCurrentInventory: getCurrentInventory,

    getUser: getUser,
    getSaleItem: getSaleItem,
    getSupplier: getSupplier,
    getPaymentMethod: getPaymentMethod,

    setCurrentUser: setCurrentUser,
    setCurrentStore: setCurrentStore,
    setSaleItem: setSaleItem,

    saveUser: saveUser,
    saveStore: saveStore,
    saveSupplier: saveSupplier,

    deleteItem: deleteItem,

    isLoggedIn: isLoggedIn,

    getTest: getTest
  };

});
