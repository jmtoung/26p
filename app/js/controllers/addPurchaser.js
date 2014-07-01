App.controller('AddPurchaserCtrl', function($scope, $rootScope, $http, $q, $location, AccountsService) {

  $scope.newPurchaser = {};
  $scope.newPurchaser.store = AccountsService.getCurrentStore().key;
  $scope.newPurchaser.firstName = 'Shirley';
  $scope.newPurchaser.lastName = 'Toung';

  $scope.addPurchaser= AccountsService.addPurchaser;

  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

});