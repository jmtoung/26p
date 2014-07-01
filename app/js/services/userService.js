App.factory('UserService', function($http, $rootScope, $firebase, $firebaseSimpleLogin, firebaseUrl, $q, $location) {

  // current user

  // create firebaseLoginObject
  var firebaseLoginObject = $firebaseSimpleLogin(new Firebase(firebaseUrl), function(error, user) {
    if (error) {
      console.log('error creating firebaseSimpleLogin: ' + error);
    } else if (user) {
      console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
    } else {
      console.log('User is logged out');
    }
  });

  // broadcast when getCurrentUser() changes
//  var broadcast = function() {
//    $rootScope.$broadcast('currentUser.update', getCurrentUser());
//  };

  // function for logging out user
  var logout = function() {
    setCurrentUser(null);
    firebaseLoginObject.$logout();
    $location.path('/');
  };

  // function to check if user is logged in
  var isLoggedIn = function() {
    if ($rootScope.currentUser) {
      return true;
    } else {
      return false;
    };
  };

  // function for getting current user
  var getCurrentUser = function() {
    return $rootScope.currentUser;
  };

  // function for setting current user
  var setCurrentUser = function(user) {
    $rootScope.currentUser = user;
//    broadcast();
  };

  // function for setting the current store for a user
  var setCurrentStore = function(store) {
    getCurrentUser().currentStore = store;
//    broadcast();
  };


  var save = function() {
    var deferred = $q.defer();
    var params = getCurrentUser();

    $http.post('rest/user/edit', params).then(function(data) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
      console.log('there was an error saving current store');
    });
    return deferred.promise;
  };


  // function for checking if user exists in GAE

  // function for getting user from GAE using firebaseId
  var getUser = function(property, value) {
    var deferred = $q.defer();
    var config = {params: {'property': property, 'value': value}};
    $http.get('/rest/user', config).then(function(data) {
    //$http.get('/rest/user/' + property + "/" + value).then(function(data) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };


  var addStore = function(store) {
    getCurrentUser().stores.push(store);
  };

//  // function for adding a store to a user in GAE
//  var addStoreToUser = function(key, storeKey) {
//    var deferred = $q.defer();
//    var params = {
//      key: key,
//      storeKey: storeKey
//    };
//    console.log(params);
//    $http.post('/rest/user/addStore', params).then(function(data) {
//      deferred.resolve(data);
//    }, function(err) {
//      deferred.reject(err);
//    });
//    return deferred.promise;
//  };



  // function for editing user from GAE
  var editUser = function(property, value, editProperty, editValue, replace) {
    var deferred = $q.defer();
    var editObj = {
      editProperty: editProperty,
      editValue: editValue,
      replace: replace
    };
    console.log(editObj);
    $http.post('/rest/user/' + property + "/" + value, editObj).then(function(data) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };


  // function for posting new user to GAE
  var _insertUser = function(user) {
    var deferred = $q.defer();
    $http.post('/rest/user', user).then(function(data) {
      console.log('added new user to GAE');
      deferred.resolve(data);
    }, function(err) {
      //console.log('error adding user to GAE');
      deferred.reject(err);
    });
    return deferred.promise;
  };

  // function for creating user
  var signUp = function(email, password) {
    console.log(email);
    firebaseLoginObject.$createUser(email, password).then(function (data) {
      // upon successful creation of firebase account, make a User entity on GAE
      var newUser = {
        'email': email,
        'firebaseUid': data.uid,
        'firebaseId': data.id
      };
      _insertUser(newUser).then(function(data) {
        // after making User on GAE, log in the user
        login(email, password, false);
      });
    });
  };

  // function for logging user in
  var login = function(email, password, rememberMe) {
    console.log(email);
    console.log(password);

    var deferred = $q.defer();
    firebaseLoginObject.$login('password', {
      email: email,
      password: password,
      rememberMe: rememberMe
    }).then(function(data) {
      // upon successful log in to firebase, pull User entity from GAE and set it to the currentUser
      getUser('firebaseUid',data.uid).then(function(data) {
        // after pulling User from GAE, set the currentUser

        console.log(data.data);
        setCurrentUser(data.data);

        // now load currentStore
//        StoreService.getStore(getCurrentUser().currentStore.key).then(function(data) {
//          console.log('got it');
//          console.log(data);
//        }, function(err) {
//          console.log('there was an error getting store: ' + err);
//        });



        //setCurrentStore();
        $location.path('/addNewSupplier');
        deferred.resolve();
      }, function(err) {
        console.log('there was an error getting user: ' + err);
      });



    });

    return deferred.promise;
  };

  return {
    signUp: signUp,
    login: login,
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    addStore: addStore,
    setCurrentStore: setCurrentStore,
    save: save,
//    addStoreToUser: addStoreToUser,
    logout: logout,
    isLoggedIn: isLoggedIn
  };

});
