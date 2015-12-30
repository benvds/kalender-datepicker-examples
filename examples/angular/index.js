;(function(angular, kalender) {
    angular
    .module('kalender.datepicker', [])
    .directive('kalender', function() {
        return {
            replace: true,
            scope: {
                selection: '=',
                weekStart: '='
            },
            template: '' +
    '<div class="kalender">' +
    '<button type="button" class="kalender-previous-month" ng-click="previousMonth()">previous</button>' +
    '<button type="button" class="kalender-current-month" ng-click="currentMonth()">current</button>' +
    '<button type="button" class="kalender-next-month" ng-click="nextMonth()">next</button>' +
    '<table class="kalender-calendar">' +
        '<caption class="kalender-calendar-title">{{ month.getFullYear() }} – {{ month.getMonth() + 1 }}</caption>' +
        '<tr>' +
            '<th ng-repeat="heading in weekDayHeadings">' +
                '{{ heading }}' +
            '</th>' +
        '</tr>' +
        '<tr ng-repeat="week in calendar">' +
            '<td class="kalender-day" ' +
                'ng-repeat="date in week" ' +
                'ng-click="setSelection(date)" ' +
                'ng-class="{ \'kalender-is-sibling-month\': isOtherMonth(date), ' +
                '\'kalender-is-today\': isToday(date), ' +
                '\'kalender-is-weekend\': isWeekendDay(date), ' +
                '\'kalender-is-selected\': isSelected(date) ' +
                '}">' +
                '{{ date.getDate() }}' +
            '</td>' +
        '</tr>' +
    '</table>' +
    '</div>',
            link: function($scope) {
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
                    $scope.month = new Date();
                };

                $scope.isOtherMonth = function(date) {
                    return date.getMonth() !== $scope.month.getMonth();
                };

                function isSameDay(first, second) {
                    return first.getDate() === second.getDate() &&
                        first.getMonth() === second.getMonth() &&
                        first.getFullYear() === second.getFullYear();
                }

                $scope.isToday = function(date) {
                    return isSameDay(date, $scope.month);
                };

                $scope.isWeekendDay = function(date) {
                    var SATURDAY_INDEX = 6;
                    var SUNDAY_INDEX = 0;

                    return (date.getDay() === SATURDAY_INDEX ||
                        date.getDay() === SUNDAY_INDEX);
                };


                $scope.isSelected = function(date) {
                    return $scope.selection &&
                        isSameDay(date, $scope.selection);
                };

                $scope.previousMonth = function() {
                    $scope.month =
                        new Date($scope.month.getFullYear(),
                                $scope.month.getMonth() - 1);
                };

                $scope.nextMonth = function() {
                    $scope.month =
                        new Date($scope.month.getFullYear(),
                                $scope.month.getMonth() + 1);
                };

                $scope.setSelection = function(date) {
                    $scope.selection = date;
                };

                $scope.$watch('month', function(month) {
                    $scope.calendar = kalender(month, $scope.weekStart);
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
        $scope.selection = { date: new Date('2015-12-23' )};
        $scope.weekStart = 1;
    }])
    ;

})(angular);
