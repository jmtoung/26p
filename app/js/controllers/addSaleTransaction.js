App.controller('AddSaleTransactionCtrl', function($scope, $rootScope, $http, $location, AccountsService) {



  AccountsService.getCurrentInventory().then(function(data) {
    $scope.currentStore = AccountsService.getCurrentStore();
    $scope.inventory = data;

    $scope.newSaleTrans = {};
    $scope.newSaleTrans.store = AccountsService.getCurrentStore();
    $scope.newSaleTrans.saleDate = "2014-07-23";
    $scope.newSaleTrans.saleTime = "9:21:00";

    $scope.newSaleTrans.saleItems = [];

    $scope.sellingMethodFeesPaymentMethod = $scope.currentStore.paymentMethods[2];

    for (var j=0; j < 2; j++) {
      var newSaleItem = {};
      newSaleItem.inventory = $scope.inventory[j];
      newSaleItem.salePrice = 1000;
      newSaleItem.saleTax = 3.5;
      newSaleItem.saleQuantity = 1;
      newSaleItem.sellingMethodFees = [{ 'feeCollector': 'ebay','name': 'Final Value Fee', 'amount': 24, 'paymentMethod': $scope.sellingMethodFeesPaymentMethod}, {'feeCollector': 'ebay','name': 'Final Value Fee on Shipping', 'amount': 21, 'paymentMethod': $scope.sellingMethodFeesPaymentMethod}];
      $scope.newSaleTrans.saleItems.push(newSaleItem);

    }

    $scope.newSaleTrans.shippingPrice = 19.95;
    $scope.newSaleTrans.sellingMethod = 'ebay';

    for (var i=0; i<$scope.newSaleTrans.saleItems.length; i++) {

    }

    $scope.newSaleTrans.paymentMethod = $scope.currentStore.paymentMethods[1];
    $scope.paymentMethodFeesPaymentMethodDefault = $scope.currentStore.paymentMethods[2];
    $scope.newSaleTrans.paymentMethodFees = [{'feeCollector': 'paypal', 'name': 'Paypal Fee', 'amount': 2.4, 'paymentMethod': $scope.paymentMethodFeesPaymentMethodDefault}];

    var newShipping = {};
    newShipping.carrier = 'USPS';
    newShipping.service = 'Priority Mail';
    newShipping.trackingNumber = '9890329849039289043';
    newShipping.packageLength = 9;
    newShipping.packageWidth = 10;
    newShipping.packageDepth = 12;
    newShipping.postageCost = 10.65;
    newShipping.signatureRequired = 'False';
    newShipping.shippingMaterials = 'Medium Flat Rate Box';

    $scope.newSaleTrans.shipping = [];
    $scope.newSaleTrans.shipping.push(newShipping);

    $scope.addSaleTransaction($scope.newSaleTrans);
  }, function(err) {
    console.log(err);
  });


  $scope.addSaleTransaction = function(newSaleTrans) {
    AccountsService.addSaleTransaction(newSaleTrans);
    console.log(newSaleTrans);
  };



});