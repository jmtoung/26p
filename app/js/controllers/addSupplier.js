App.controller('AddSupplierCtrl', function($scope, $rootScope, $http, $q, $location, AccountsService) {

  $scope.newSupp = {};
  $scope.newSupp.store = AccountsService.getCurrentStore();
  $scope.newSupp.name = 'Gilroy Premium Outlets';
  $scope.newSupp.address1 = '3859 Timlott Court';
  $scope.newSupp.address2 = 'Apt 2';
  $scope.newSupp.city = 'Gilroy';
  $scope.newSupp.state = 'California';
  $scope.newSupp.zipCode = '94306';
  $scope.newSupp.phoneNumber = '650-450-8064';
  $scope.newSupp.website = 'coach.com';

  $scope.addSupplier = AccountsService.addSupplier;

  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

});