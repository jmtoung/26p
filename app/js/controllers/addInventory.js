App.controller('AddInventoryCtrl', function($scope, $rootScope, $http, $location, AccountsService) {

  // initializing functions

  function addLeadingZero(x) {
    if (x < 10) {
      x = "0" + x;
    }
    return x;
  }

  var setInitialSupplier = function() {
    var lastSupplier = AccountsService.getCurrentStore().lastSupplier;
    for (var i=0; i < $scope.suppliers.length; i++) {
      if ($scope.suppliers[i].key == lastSupplier.key) {
        $scope.newInv.supplier = $scope.suppliers[i];
      }
    }
  };

  var setInitialPurchaser = function() {
    var lastPurchaser = AccountsService.getCurrentStore().lastPurchaser;
    for (var i=0; i < $scope.purchasers.length; i++) {
      if ($scope.purchasers[i].key == lastPurchaser.key) {
        $scope.newInv.purchaser = $scope.purchasers[i];
      }
    }
  };

  var setInitialPaymentMethod = function() {
    var lastPaymentMethod = AccountsService.getCurrentStore().lastPaymentMethod;

    if ($scope.paymentMethods) {
      for (var i=0; i < $scope.paymentMethods.length; i++) {
        if ($scope.paymentMethods[i].key == lastPaymentMethod.key) {
          $scope.newInv.paymentMethod = $scope.paymentMethods[i];
        }
      }
    }
  };

  var generatePaymentMethodsObject = function() {
    var pM = AccountsService.getCurrentStore().paymentMethods;
    var pM_form = {};
    for (var i=0; i < pM.length; i++) {
      var name = pM[i].cardType + " (" + pM[i].accountNumber + ")";
      var type = pM[i].type;
      var key = pM[i].key;
      if (!(pM[i].purchaser.displayName in pM_form)) {
        pM_form[pM[i].purchaser.displayName] = [];
      }
      pM_form[pM[i].purchaser.displayName].push({name: name, type: type, key: key});
    }

    return pM_form
  };

  $scope.loadPaymentMethods = function(purchaser) {
    $scope.paymentMethods = pM_form[purchaser.displayName];
  };

  var counter = 1;
  var initializeNewItem = function() {


    $scope.newItem = {};

    $scope.newItem.category = 'Handbags/Accessories';
    $scope.newItem.brand = 'Coach';
    $scope.newItem.quantity = 2 + counter;
    $scope.newItem.unitPrice = 100*counter;
    $scope.newItem.totalPrice = $scope.newItem.quantity * $scope.newItem.unitPrice;
    $scope.newItem.itemNumber = 'F70487';
    $scope.newItem.itemName = 'Weekend Tote';
    $scope.newItem.itemSpecifics = 'Notes';
    $scope.newItem.itemSize = 'Large';
    $scope.newItem.itemColor = 'Brass/Chili';
    counter = counter + 1;

  };



  $scope.newInv = {};
  $scope.newInv.submitter = AccountsService.getCurrentUser();
  $scope.newInv.store = AccountsService.getCurrentStore();

  // initialize $scope.newInv.purchaseDate and $scope.newInv.purchaseTime to current date/time
  var now = new Date();
  var day = addLeadingZero(now.getDate());
  var month = addLeadingZero(now.getMonth() + 1);
  var year = now.getFullYear();
  var hour = addLeadingZero(now.getHours());
  var min = addLeadingZero(now.getMinutes());
  var sec = addLeadingZero(now.getSeconds());

  $scope.newInv.purchaseDate = year + "-" + month + "-" + day;
  $scope.newInv.purchaseTime = hour + ":" + min;
  $scope.newInv.receiptNumber = 'V2324905324';
  $scope.newInv.totalPrice2 = 0;
  $scope.newInv.subtotal = 0;
  $scope.newInv.store = AccountsService.getCurrentStore();
  initializeNewItem();

  $scope.newItems = [];



  $scope.suppliers = AccountsService.getCurrentStore().suppliers;

  $scope.purchasers = AccountsService.getCurrentStore().purchasers;

  // set initial supplier/purchaser to last supplier/purchaser
  setInitialSupplier();
  setInitialPurchaser();
  // generate payment methods object
  var pM_form = generatePaymentMethodsObject();
  // load the appropriate payment method options
  $scope.loadPaymentMethods($scope.newInv.purchaser);
  setInitialPaymentMethod();




  $scope.addNewInventory = function() {
    AccountsService.addInventory($scope.newInv, $scope.newItems)

  };





  $scope.updatePrices = function() {
    console.log('updating prices');
    if ($scope.newItem.unitPrice) {
       $scope.newItem.totalPrice = $scope.newItem.unitPrice * $scope.newItem.quantity;
    }
  };

  $scope.updateTotalPrice = function() {
    console.log('updating total prices');
    if ($scope.newItem.quantity) {
      $scope.newItem.totalPrice = $scope.newItem.unitPrice * $scope.newItem.quantity;
    }
  };

  $scope.updateUnitPrice = function() {
    if ($scope.newItem.quantity) {
      $scope.newItem.unitPrice = $scope.newItem.totalPrice / $scope.newItem.quantity;
    }
  };

  $scope.updateTax = function() {
    console.log('updating tax');
    if ($scope.newInv.subtotal && $scope.newInv.taxPercentage) {
      $scope.newInv.tax = $scope.newInv.subtotal * $scope.newInv.taxPercentage / 100;
      $scope.newInv.totalPrice2 = $scope.newInv.subtotal + $scope.newInv.tax;
    }
  };

  $scope.updateTaxPercentage = function() {
    console.log('updating tax percentage');
    if ($scope.newInv.subtotal && $scope.newInv.tax) {
      $scope.newInv.taxPercentage = $scope.newInv.tax / $scope.newInv.subtotal * 100;
      $scope.newInv.totalPrice2 = $scope.newInv.subtotal + $scope.newInv.tax;
    }
  };

  $scope.addInventory = function() {
    AccountsService.addInventory($scope.newInv, $scope.newItems);
  };

  $scope.addNewItem = function() {
    $scope.newItems.push($scope.newItem);
    if (!$scope.newInv.subtotal) {
      $scope.newInv.subtotal = 0;
    }
    $scope.newInv.subtotal += $scope.newItem.totalPrice;
    initializeNewItem();
  };



});