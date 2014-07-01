'use strict';

App.factory('myHttpInterceptor', function($rootScope, $q) {
  return {
    'requestError': function(config) {
      $rootScope.status = 'HTTP REQUEST ERROR ' + config;
      return config || $q.when(config);
    },
    'responseError': function(rejection) {
      $rootScope.status = 'HTTP RESPONSE ERROR ' + rejection.status + '\n' +
        rejection.data;
      return $q.reject(rejection);
    },
  };
});

App.config(function($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
});

App.factory('guestService', function($rootScope, $http, $q, $log) {
  $rootScope.status = 'Retrieving data...';
  var deferred = $q.defer();
  $http.get('rest/query')
    .success(function(data, status, headers, config) {
      $rootScope.guests = data;
      deferred.resolve();
      $rootScope.status = '';
    });
  return deferred.promise;
});

App.factory('Inventory', ['$resource',
  function($resource) {
    return $resource('/rest/store/:storeId/inventory/:id',
      {storeId: 123, id: '@id'});
  }]);

App.factory('MultiInventoryLoader', ['Inventory', '$q', '$rootScope',
  function(Inventory, $q, $rootScope) {
    return function() {
      var delay = $q.defer();
      Inventory.query(function(data) {
        $rootScope.inventory = data;
        delay.resolve();
      }, function() {
        delay.reject('Unable to fetch inventories');
      });
      return delay.promise;
    };
  }]);



App.factory('UserProfileService', function($http) {
  // check if there already is a session open

  var currentUser;

  return {
    setCurrentUser: function(user) {
      currentUser = user;
    },
    getCurrentUser: function() {
      return currentUser;
    }
  };

});

App.factory('InventoryService', function($rootScope, $http, $q, $log) {
  $rootScope.status = 'Retrieving data...';

  var deferred = $q.defer();
  $http.get('rest/store/123/inventory')
    .success(function(data, status, headers, config) {
      $rootScope.inventory = data;
      console.log(data);
      deferred.resolve();
      $rootScope.status = '';
    });
  return deferred.promise;
});

App.factory('InventoryLoader', ['Inventory', '$route', '$q',
  function(Inventory, $route, $q) {
    return function() {
      var delay = $q.defer();
      Inventory.get({id: $route.current.params.inventoryId}, function(inventory) {
        delay.resolve(inventory);
      }, function() {
        delay.reject('Unable to fetch inventory'  + $route.current.params.inventoryId);
      });
      return delay.promise;
    };
  }]);
