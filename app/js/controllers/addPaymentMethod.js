App.controller('AddPaymentMethodCtrl', function($scope, $rootScope, $http, $location, AccountsService, $window) {


  //AccountsService.getTest({'test': 'What sounded like the most tragic of accidents -- a dad absentmindedly leaving his toddler in the car on a scorching Georgia day -- is now being treated by police as a horrific, and intentional, crime. Two new details were added to a revised Cobb County criminal warrant Tuesday: Not only did Justin Ross Harris put his son in the car minutes before arriving at work on June 18, but he returned to his car hours later during his lunch break. Harris placed his son, 22-month old Cooper, into a rear-facing child restraint in the backseat of his Hyundai Tucson after eating breakfast at a fast-food restaurant. He then drove to his workplace, a Home Depot corporate office about a half-mile away, according to the warrant.'});

  $scope.purchasers = AccountsService.getCurrentStore().purchasers;
  var lastPurchaser = AccountsService.getCurrentStore().lastPurchaser;
  // set default purchaser to last purchaser

  $scope.newPaymentMethod = {};
  $scope.newPaymentMethod.type = 'Credit Card';
  $scope.newPaymentMethod.accountNumber = '6214';
  $scope.newPaymentMethod.cardType = 'Visa';
  $scope.newPaymentMethod.expirationDate = "2014-06-10";
  $scope.newPaymentMethod.bank = 'Chase'

  for (var i=0; i < $scope.purchasers.length; i++) {

    if (lastPurchaser.key == $scope.purchasers[i].key) {
      $scope.newPaymentMethod.purchaser = $scope.purchasers[i];
    }
  }


  $scope.selectPurchaser = function() {
    console.log($scope.selectedSupplier);
  };



  $scope.queuedPaymentMethods = [];
  $scope.queuedPaymentTypes = {};

  $scope.queuePaymentMethod = function() {
    $scope.queuedPaymentMethods.push($scope.newPaymentMethod);

    if (!$scope.queuedPaymentTypes[$scope.newPaymentMethod.type]) {
      $scope.queuedPaymentTypes[$scope.newPaymentMethod.type] = 0
    };

    $scope.queuedPaymentTypes[$scope.newPaymentMethod.type]++;

    $scope.newPaymentMethod = {};
  };



  $scope.paymentTypes = [
    'Credit Card',
    'Debit Card',
    'Bank Account',
    'Cash',
    'Paypal'
  ];

  $scope.cardTypes = [
    'Visa',
    'Master Card',
    'American Express',
    'Discover'
  ];

  $scope.creditCards = [];
//  $scope.creditCards = [{paymentType: 'Credit Card', cardType: 'Visa', last4: 6214, bank: 'Chase'}];
  $scope.bankAccounts = [];

  $scope.paymentMethodTypeCheck = function(paymentMethodType) {
    return ($scope.queuedPaymentTypes[paymentMethodType] > 0) ? true : false;
  };

  $scope.bankAccountCheck = function() {
    return $scope.bankAccounts.length ? true : false;
  };

  $scope.addPaymentMethods = function() {
    for (var i=0; i < $scope.queuedPaymentMethods.length; i++) {
      $scope.queuedPaymentMethods[i].owner = AccountsService.getCurrentUser();
      $scope.queuedPaymentMethods[i].store = AccountsService.getCurrentStore();
      console.log($scope.queuedPaymentMethods[i]);
      AccountsService.addPaymentMethod($scope.queuedPaymentMethods[i]);
    }

  };

});