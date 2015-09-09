angular.module('firstApp', [])

.controller('mainController', function() {
  var vm = this;

  vm.message = 'Hey there! Come and see how good I look!';

  vm.computers = [
    { name: 'Macbook Pro', colour: 'Silver', nerdness: 7, lameness: 10 },
    { name: 'Yoga 2 pro', colour: 'Gray', nerdness: 6, lameness: 0 },
    { name: 'Chromebook', colour: 'Black', nerdness: 5, lameness: 0 }
  ];
});
