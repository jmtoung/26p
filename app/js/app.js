'use strict';

var App = angular.module('App', ['ngRoute', 'ngResource', 'firebase']); //, 'ui.bootstrap']);

App.constant("firebaseUrl", "https://boiling-fire-8573.firebaseio.com/");
App.constant("storeListActiveClass", "btn-primary");

App.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller : 'MainCtrl',
    templateUrl: '/partials/main.html',
  //  resolve    : { 'guestService': 'guestService',
  //  },
  });
  $routeProvider.when('/signup', {
    controller : 'AuthCtrl',
    templateUrl: '/partials/signup.html',
  });
  $routeProvider.when('/login', {
    controller : 'AuthCtrl',
    templateUrl: '/partials/login.html',
  });
  $routeProvider.when('/dashboard', {
    controller : 'DashCtrl',
    templateUrl: '/partials/dashboard.html',
  });
  $routeProvider.when('/addStore', {
    controller : 'AddStoreCtrl',
    templateUrl: '/partials/addStore.html',
  });
  $routeProvider.when('/stores', {
    controller : 'AddStoreCtrl',
    templateUrl: '/partials/stores.html',
  });
  $routeProvider.when('/inventory', {
    controller : 'InventoryCtrl',
    templateUrl: '/partials/inventory.html',
//    resolve: {'InventoryService' : 'InventoryService'}
//    resolve: {
//      inventory: ["Inventory", function(Inventory) {
//        return Inventory;
//      }],
//      multiInventory: ["MultiInventoryLoader", function(MultiInventoryLoader) {
//        return MultiInventoryLoader;
//      }]
//    }
  });
  $routeProvider.when('/addInventory', {
    controller : 'AddInventoryCtrl',
    templateUrl: '/partials/addInventory.html',
  });
  $routeProvider.when('/addPaymentMethod', {
    controller : 'AddPaymentMethodCtrl',
    templateUrl: '/partials/addPaymentMethod.html',
  });
  $routeProvider.when('/addSupplier', {
    controller : 'AddSupplierCtrl',
    templateUrl: '/partials/addSupplier.html',
  });
  $routeProvider.when('/addPurchaser', {
    controller : 'AddPurchaserCtrl',
    templateUrl: '/partials/addPurchaser.html',
  });
  $routeProvider.when('/addSaleTransaction', {
    controller : 'AddSaleTransactionCtrl',
    templateUrl: '/partials/addSaleTransaction.html',
  });
  $routeProvider.when('/update/:id', {
    controller : 'UpdateCtrl',
    templateUrl: '/partials/update.html',
    resolve    : { 'guestService': 'guestService' },
  });
  $routeProvider.otherwise({
    redirectTo : '/'
  });
});

App.config(function($httpProvider) {
  $httpProvider.interceptors.push('myHttpInterceptor');
});

App.run(function($rootScope, $location, AccountsService) {
    // enumerate routes that don't need authentication
    var routesDontRequireAuth = ['/login', '/signup'];

    // function for checking if a location matches route
    var routeClean = function(route) {
        // if route is '/', this is clean
        if (route == "/") {
            return true;
        // for other routes, check if it starts with one of the routes that don't require auth
        // otherwise, needs login
        } else {
            var val =  _.find(routesDontRequireAuth, function(noAuthRoute) {
                return _.str.startsWith(route, noAuthRoute);
            });
            if (val) {
              return true;
            } else {
              return false;
            }
        }
    };

    $rootScope.$on('$routeChangeStart', function(event, next, current) {

      // if route is clean (doesn't require login) then don't do anything
      if (routeClean($location.url())) {
      // if route requires login, check if user is logged in
      } else {
        // if user is not logged, redirect them to login
        if (!AccountsService.isLoggedIn()) {
          console.log('we are at unclean route and we are not logged in: ' + $location.url());
          $location.path('/login');
        } else {
          if (!(AccountsService.getCurrentUser())) {
            console.log('current user not defined');
          }
          if (!(AccountsService.getCurrentStore())) {
            console.log('current store not defined');
          }

          $rootScope.currentUser = AccountsService.getCurrentUser();
          $rootScope.currentStore = AccountsService.getCurrentStore();
        }
      }
    });
});