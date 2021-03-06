;(function(angular, kalender, util) {
    angular
    .module('kalender.datepicker', [])
    .directive('kalender', function() {
        return {
            replace: true,
            scope: {
                selection: '=',
                highlights: '=',
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
                '\'kalender-is-weekend\': isWeekend(date), ' +
                '\'kalender-is-highlighted\': isHighlighted(date), ' +
                '\'kalender-is-selected\': isSelected(date), ' +
                '\'kalender-is-in-between\': isInBetween(date) ' +
                '}">' +
                '{{ date.getDate() }}' +
            '</td>' +
        '</tr>' +
    '</table>' +
'</div>',
            link: function($scope) {
                var today = new Date();

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
                $scope.highlights = $scope.highlights || [];

                $scope.currentMonth = function() {
                    $scope.month = new Date();
                };

                $scope.isOtherMonth = function(date) {
                    return date.getMonth() !== $scope.month.getMonth();
                };

                $scope.isToday = function(date) {
                    return util.isSameDay(date, today);
                };

                $scope.isWeekend = util.isWeekend;

                $scope.isHighlighted = function(date) {
                    return $scope.highlights.some(function(selection) {
                        return util.isSameDay(date, selection);
                    });
                };

                $scope.isSelected = function(date) {
                    return $scope.selection &&
                        util.isSameDay($scope.selection, date);
                }

                $scope.isInBetween = function(date) {
                    return util.isInBetween($scope.highlights, date);
                };

                $scope.previousMonth = function() {
                    $scope.month = util.prevMonth($scope.month);
                };

                $scope.nextMonth = function() {
                    $scope.month = util.nextMonth($scope.month);
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
})(angular, kalender, util);

(function(angular) {

    angular
    .module('kalenderExampleAngular', ['kalender.datepicker'])
    .controller('MainController', ['$scope', function($scope) {
        $scope.selection = {
            dates: [
                new Date('2015-12-17'),
                new Date('2015-12-24'),
            ]
        };
        $scope.weekStart = 1;
    }])
    ;

})(angular);
