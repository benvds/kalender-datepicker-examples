(function(kalender) {
    angular.module('kaApp', [])
    .constant('kalender', kalender)
    // .run(function ($rootScope) {
    //     $rootScope._ = _;
    // })
    .controller('MainController', ['$scope', function($scope) {
        $scope.DEBUG = true;
    }])
    .directive('kaCal', function() {
        function getWeeks(calendar) {
            var amountOfWeeks = calendar.length / 7;
            var weeks = [];

            for (var week = 0; week < amountOfWeeks; week ++) {
                weeks.push(calendar.slice(week * 7, (week + 1) * 7));
            }

            return weeks;
        }
        return {
            replace: true,
            template: '' +
'<div class="kalender-cal">' +
    '<button type="button" class="kalender-previous-month" ng-click="previousMonth()">previous</button>' +
    '<button type="button" class="kalender-next-month" ng-click="nextMonth()">next</button>' +
    '<table class="kalender-cur-month">' +
        '<caption class="kalender-cur-month-title">{{ currentMonth.year }} – {{ currentMonth.month }}<caption>' +
        '<tr>' +
            '<th ng-repeat="heading in weekDayHeadings">' +
                '{{ heading }}' +
            '</th>' +
        '</tr>' +
        '<tr ng-repeat="week in weeks">' +
            '<td ng-repeat="day in week" ng-class="{ \'kalender-is-sibling-month\': day.isSiblingMonth }">' +
                '{{ day.day }}' +
            '</td>' +
        '</tr>' +
    '</table>' +
'</div>',
            link: function($scope) {
                $scope.weeks = [];
                $scope.weekDayHeadings = [
                    'mon',
                    'tue',
                    'wed',
                    'thu',
                    'fri',
                    'sat',
                    'sun'
                ];
                $scope.currentMonth = {
                    year: 1900 + (new Date()).getYear(),
                    month: 1 + (new Date()).getMonth()
                };

                $scope.previousMonth = function() {
                    $scope.currentMonth =
                        kalender.month.previousMonth($scope.currentMonth);
                };

                $scope.nextMonth = function() {
                    $scope.currentMonth =
                        kalender.month.nextMonth($scope.currentMonth);
                };

                $scope.$watch('currentMonth', function(currentMonth) {
                    var calendar =
                        kalender.calendar({ year: currentMonth.year,
                                          month: currentMonth.month },
                                          { weekStart: 2 });

                    $scope.weeks = getWeeks(calendar);
                }, true);

            }
        };
    })
    ;
})(kalender);
