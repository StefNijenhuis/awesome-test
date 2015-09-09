angular.module('firstApp', [])

.controller('mainController', function() {

  // bind this to vm (view-model)
  var vm = this;

  // define variables and objects on this
  // this lets them be available to our views

  // define a basic variable
  vm.message = 'Hey there! Come and see how good I look!';

  // define a list of items
  vm.computers = [
    { name: 'Macbook Pro', colour: 'Silver', nerdness: 7, lameness: 10 },
    { name: 'Yoga 2 pro', colour: 'Gray', nerdness: 6, lameness: 0 },
    { name: 'Chromebook', colour: 'Black', nerdness: 5, lameness: 0 }
  ];

  // information that comes from our form
  vm.computerData = {};

  vm.addComputer = function() {

    // add a computer to the list
    vm.computers.push({
      name: vm.computerData.name,
      colour: vm.computerData.colour,
      nerdness: vm.computerData.nerdness,
      lameness: vm.computerData.lameness
    });

    // after our computer has been added, clear the form
    vm.computerData = {};
  };
});
