;(function(angular, kalender) {
    angular
    .module('kalender.datepicker', [])
    .constant('kalender', kalender)
    .directive('kalenderDatepicker', function() {
        return {
            replace: true,
            scope: {
                selection: '='
            },
            template: '' +
    '<div class="kalender">' +
    '<button type="button" class="kalender-previous-month" ng-click="previousMonth()">previous</button>' +
    '<button type="button" class="kalender-current-month" ng-click="currentMonth()">current</button>' +
    '<button type="button" class="kalender-next-month" ng-click="nextMonth()">next</button>' +
    '<table class="kalender-calendar">' +
        '<caption class="kalender-calendar-title">{{ month.year }} – {{ month.month }}</caption>' +
        '<tr>' +
            '<th ng-repeat="heading in weekDayHeadings">' +
                '{{ heading }}' +
            '</th>' +
        '</tr>' +
        '<tr ng-repeat="week in calendar">' +
            '<td class="kalender-day" ' +
                'ng-repeat="day in week" ' +
                'ng-click="setSelection(day)" ' +
                'ng-class="{ \'kalender-is-sibling-month\': day.isSiblingMonth, ' +
                '\'kalender-is-today\': day.isToday, ' +
                '\'kalender-is-weekend\': isWeekendDay(day), ' +
                '\'kalender-is-selected\': isSelected(day) ' +
                '}">' +
                '{{ day.day }}' +
            '</td>' +
        '</tr>' +
    '</table>' +
    '</div>',
            link: function($scope) {
                var options = { weekStart: 1 };

                $scope.calendar = [];
                $scope.weekDayHeadings = [
                    'mon',
                    'tue',
                    'wed',
                    'thu',
                    'fri',
                    'sat',
                    'sun'
                ];
                $scope.currentMonth = function() {
                    $scope.month = new kalender.Month({
                        year: (new Date()).getFullYear(),
                        month: 1 + (new Date()).getMonth()
                    });
                };

                $scope.isSelected = function(day) {
                    // if (angular.isDefined($scope.selection)) {
                    //     return kalender.day.isEqual($scope.selection, day);
                    // } else {
                        return false;
                    // }
                };

                $scope.previousMonth = function() {
                    $scope.month = $scope.month.previous();
                };

                $scope.nextMonth = function() {
                    $scope.month = $scope.month.next();
                };

                $scope.setSelection = function(day) {
                    // $scope.selection = day;
                };

                $scope.isWeekendDay = function(day) {
                    var SATURDAY_DAY_OF_WEEK = 6;
                    var SUNDAY_DAY_OF_WEEK = 0;

                    return (day.dayOfWeek === SATURDAY_DAY_OF_WEEK ||
                        day.dayOfWeek === SUNDAY_DAY_OF_WEEK);
                };

                $scope.$watch('month', function(month) {
                    $scope.calendar =
                        (new kalender.Calendar(month, options)).days();
                }, true);

                $scope.currentMonth();
            }
        };
    })
    ;
})(angular, kalender);

(function(angular) {

    angular
    .module('kalenderExampleAngular', ['kalender.datepicker'])
    .controller('MainController', ['$scope', function($scope) {
        $scope.selection = { year: 2015, month: 6, day: 3 };
    }])
    ;

})(angular);
