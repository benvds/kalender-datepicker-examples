(function() {

    angular
    .module('kalenderExampleAngular', ['kalender.datepicker'])
    .controller('MainController', ['$scope', function($scope) {
        $scope.selection = { year: 2015, month: 6, day: 3 };
    }])
    ;

})();
