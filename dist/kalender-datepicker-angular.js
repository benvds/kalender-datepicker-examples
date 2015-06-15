(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.kalenderDatepickerAngular = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var kalender = require('kalender');

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
    '<caption class="kalender-calendar-title">{{ month.year }} – {{ month.month }}<caption>' +
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
            '\'kalender-is-in-between\': day.isInBetween, ' +
            '\'kalender-is-weekend\': day.isWeekend, ' +
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
                $scope.month = {
                    year: (new Date()).getFullYear(),
                    month: 1 + (new Date()).getMonth()
                };
            };

            $scope.isSelected = function(day) {
                if (angular.isDefined($scope.selection)) {
                    return kalender.day.isEqual($scope.selection, day);
                } else {
                    return false;
                }
            };

            $scope.previousMonth = function() {
                $scope.month =
                    kalender.month.previousMonth($scope.month);
            };

            $scope.nextMonth = function() {
                $scope.month =
                    kalender.month.nextMonth($scope.month);
            };

            $scope.setSelection = function(day) {
                $scope.selection = day;
            };

            $scope.$watch('month', function(month) {
                $scope.calendar = kalender.calendar(month, options);

                // set isSelected
                if (angular.isDefined($scope.selection)) {
                    $scope.calendar = $scope.calendar.map(function(week) {
                        return week.map(function(day) {
                            if (kalender.day.isEqual(day, $scope.selection)) {
                                day.isSelected = true;
                            }

                            return day;
                        });
                    });
                }

                // set isWeekend
                var SATURDAY_DAY_OF_WEEK = 6;
                var SUNDAY_DAY_OF_WEEK = 0;

                $scope.calendar = $scope.calendar.map(function(week) {
                    return week.map(function(day) {
                        if (day.dayOfWeek === SATURDAY_DAY_OF_WEEK ||
                            day.dayOfWeek === SUNDAY_DAY_OF_WEEK)
                        {
                            day.isWeekend = true;
                        }

                        return day;
                    });
                });
            }, true);

            $scope.currentMonth();
        }
    };
})
;

},{"kalender":2}],2:[function(require,module,exports){
module.exports = {
    year: require('./lib/year'),
    month: require('./lib/month'),
    day: require('./lib/day'),
    calendar: require('./lib/calendar'),
    util: require('./lib/util')
};

},{"./lib/calendar":3,"./lib/day":4,"./lib/month":5,"./lib/util":6,"./lib/year":7}],3:[function(require,module,exports){
'use strict';

var month = require('./month');
var day = require('./day');

var DAYS_PER_WEEK = 7;

/**
 * Returns collection of day objects for the given month. Includes days from
 * sibling months to make for full weeks. Defaults to the current month.
 *
 * @argument {Object} month
 * @argument {Number} month.year
 * @argument {Number} month.month
 * @argument {Object} options
 * @argument {Number} options.weekStart sets the first day of week
 *
 * @returns {Object[]} days
 */
function calendar(_currentMonth, options) {
    var currentMonth = _currentMonth || getCurrentMonth();
    var days = []
        .concat(daysMissingBefore(currentMonth, weekStart(options)))
        .concat(month.days(currentMonth))
        .concat(daysMissingAfter(currentMonth, weekStart(options)));

    return groupPerWeek(days);
}

/**
 * Group the days per week.
 *
 * @argument {Object[]} days
 *
 * @returns {Object[][]} returns a matrix of weeks and days
 */
function groupPerWeek(days) {
    var amountOfWeeks = days.length / DAYS_PER_WEEK;
    var weeks = [];

    for (var week = 0; week < amountOfWeeks; week++) {
        weeks.push(days.slice(week * DAYS_PER_WEEK,
                              (week + 1) * DAYS_PER_WEEK));
    }

    return weeks;
}

/**
 * Returns week start using the one defined in options otherwise falls back to
 * default week start.
 *
 * @argument {Object} options
 * @argument {Number} options.weekStart sets the first day of week
 *
 * @returns {Number} week start
 */
function weekStart(options) {
    var WEEK_START_DEFAULT = 0;

    if (options && options.weekStart) {
        return options.weekStart;
    } else {
        return WEEK_START_DEFAULT;
    }
}

/**
 * Returns collection of day objects for the month before given month. Only
 * includes days to make a full week.
 *
 * @argument {Object} month
 * @argument {Number} month.year
 * @argument {Number} month.month
 *
 * @returns {Array} collection of days
 */
function daysMissingBefore(currentMonth, weekStart) {
    if (amountMissingBefore(currentMonth, weekStart)) {
        var days = month.days(month.previousMonth(currentMonth))
            .slice(-1 * amountMissingBefore(currentMonth, weekStart));

        return markAsSiblingMonth(days);
    } else {
        return [];
    }
}

/**
 * Returns amount of days missing before given month to make a full week.
 *
 * @argument {Object} month
 * @argument {Number} month.year
 * @argument {Number} month.month
 *
 * @returns {Number} amount of days
 */
function amountMissingBefore(currentMonth, weekStart) {
    return (DAYS_PER_WEEK - weekStart +
            month.days(currentMonth)[0].dayOfWeek) % DAYS_PER_WEEK;
}

/**
 * Returns collection of day objects for the month after given month. Only
 * includes days to make a full week.
 *
 * @argument {Object} month
 * @argument {Number} month.year
 * @argument {Number} month.month
 *
 * @returns {Array} collection of days
 */
function daysMissingAfter(currentMonth, weekStart) {
    if (amountMissingAfter(currentMonth, weekStart)) {
        var days = month.days(month.nextMonth(currentMonth))
            .slice(0, amountMissingAfter(currentMonth, weekStart));

        return markAsSiblingMonth(days);
    } else {
        return [];
    }
}

/**
 * Returns amount of days missing after given month to make a full week.
 *
 * @argument {Object} month
 * @argument {Number} month.year
 * @argument {Number} month.month
 *
 * @returns {Number} amount of days
 */
function amountMissingAfter(currentMonth, weekStart) {
    var days = month.days(currentMonth);
    var lastDayOfWeek = day.dayOfWeek(days[(days.length - 1)]);

    return ((DAYS_PER_WEEK + weekStart) - lastDayOfWeek - 1) % DAYS_PER_WEEK;
}

/**
 * Returns collection of days marked as sibling month.
 *
 * @argument {Object[]} days
 * @argument {Number} days[].year
 * @argument {Number} days[].month
 * @argument {Number} days[].day
 *
 * @returns {Object[]} days with attribute isSiblingMonth: true
 */
function markAsSiblingMonth(days) {
    return days.map(function(day) {
        day.isSiblingMonth = true;

        return day;
    });
}

/**
 * Returns the current month
 *
 * @returns {Object} month
 */
function getCurrentMonth() {
    var currentDate = new Date();

    return {
        year: currentDate.getFullYear(),
        month: (currentDate.getMonth() + 1)
    };
}

module.exports = calendar;

},{"./day":4,"./month":5}],4:[function(require,module,exports){
'use strict';

var DAY_WEIGHTS = {
    year: 385,
    month: 32,
    day: 1
};

/**
 * Returns day of week for given day. 1 for sunday, 7 for monday.
 *
 * @argument {Object} day
 * @argument {Number} day.year
 * @argument {Number} day.month
 * @argument {Number} day.day
 *
 * @returns {Number} day of week
 */
function dayOfWeek(day) {
    var date = new Date(day.year, day.month - 1, day.day);

    return date.getDay();
}

/**
 * Returns if subject day is before comparison day.
 *
 * @argument {Object} subject day
 * @argument {Object} comparsion day
 *
 * @returns {Boolean} true when subject day is before comparison day
 */
function isBefore(subject, comparison) {
    return dayWeight(subject) < dayWeight(comparison);
}

/**
 * Returns if subject day is after comparison day.
 *
 * @argument {Object} subject day
 * @argument {Object} comparsion day
 *
 * @returns {Boolean} true when subject day is after comparison day
 */
function isAfter(subject, comparison) {
    return dayWeight(subject) > dayWeight(comparison);
}

/**
 * Returns weight for a day which can be used in comparisons. Weights are not
 * relative to each other. Later dates only have higher weights. Using weights
 * is more than a 100 times faster than creating a date and getting the
 * primitive value.
 *
 * @argument {Object} day
 * @argument {Number} day.year
 * @argument {Number} day.month
 * @argument {Number} day.day
 *
 * @returns {Number} dayWeight timestamp for start of day
 */
function dayWeight(day) {
    return (day.day * DAY_WEIGHTS.day) +
        (day.month * DAY_WEIGHTS.month) +
        (day.year * DAY_WEIGHTS.year);
}

/**
 * Returns if subject day is the same as the comparison day.
 *
 * @argument {Object} subject day
 * @argument {Object} comparsion day
 *
 * @returns {Boolean} true when subject day is the same as the comparison day
 */
function isEqual(subject, comparison) {
    return (subject.day === comparison.day) &&
        (subject.month === comparison.month) &&
        (subject.year === comparison.year);
}

module.exports = {
    dayOfWeek: dayOfWeek,
    isBefore: isBefore,
    isAfter: isAfter,
    isEqual: isEqual
};

},{}],5:[function(require,module,exports){
'use strict';

var year = require('./year');
var day = require('./day');

var MONTHS_PER_YEAR = 12;

/**
 * Returns amount of days for given month, includes leap days.
 *
 * @argument {Object} month
 * @argument {Number} month.year
 * @argument {Number} month.month
 *
 * @returns {Number} amount of days
 */
function amountOfDays(month) {
    var DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var normalAmount = DAYS_PER_MONTH[month.month - 1];

    return hasLeapDay(month) ? normalAmount + 1 : normalAmount;
}

/**
 * Returns true when given month has a leap day.
 *
 * @argument {Object} month
 * @argument {Number} month.year
 * @argument {Number} month.month
 *
 * @returns {Boolean}
 */
function hasLeapDay(month) {
    var MONTH_WITH_ADDITIONAL_DAY_ON_LEAP_YEAR = 2;

    return (month.month === MONTH_WITH_ADDITIONAL_DAY_ON_LEAP_YEAR &&
        year.isLeapYear(month.year));
}

/**
 * Returns month previous to given month.
 *
 * @argument {Object} month
 * @argument {Number} month.year
 * @argument {Number} month.month
 *
 * @returns {Object} new month object
 */
function previousMonth(month) {
    if (month.month === 1) {
        return {
            year: (month.year - 1),
            month: MONTHS_PER_YEAR
        };
    } else {
        return {
            year: month.year,
            month: (month.month - 1)
        };
    }
}

/**
 * Returns month next to given month.
 *
 * @argument {Object} month
 * @argument {Number} month.year
 * @argument {Number} month.month
 *
 * @returns {Object} new month object
 */
function nextMonth(month) {
    if (month.month === MONTHS_PER_YEAR) {
        return {
            year: (month.year + 1),
            month: 1
        };
    } else {
        return {
            year: month.year,
            month: (month.month + 1)
        };
    }
}

/**
 * Returns collection of day objects for given month.
 *
 * @argument {Object} month
 * @argument {Number} month.year
 * @argument {Number} month.month
 *
 * @returns {Array} collection of day objects
 */
function days(month) {
    var result = [];

    for (var currentDay = 1, amount = amountOfDays(month);
         currentDay <= amount;
         currentDay++)
    {
        result.push({
            year: month.year,
            month: month.month,
            day: currentDay,
            dayOfWeek: day.dayOfWeek({
                year: month.year,
                month: month.month,
                day: currentDay
            })
        });
    }

    return flagToday(result);
}

function flagToday(days) {
    var curDate = new Date();
    var dayOfMonth = curDate.getDate();

    if (days[0].year === curDate.getFullYear() &&
        days[0].month === (curDate.getMonth() + 1))
    {
        return days.map(function(day) {
            if (day.day === dayOfMonth) {
                day.isToday = true;
            }

            return day;
        });
    } else {
        return days;
    }

}

module.exports = {
    amountOfDays: amountOfDays,
    previousMonth: previousMonth,
    nextMonth: nextMonth,
    days: days
};

},{"./day":4,"./year":7}],6:[function(require,module,exports){
'use strict';

/**
 * Returns a new calendar with the results of calling a provided callback
 * function on every day.
 *
 * @argument {Object[][]} calendar
 * @argument {Function} callback
 *
 * @returns {Object[][]} calendar with days mapped with callback
 */
function mapDays(calendar, callback) {
    return calendar.map(function(week) {
        return week.map(callback);
    });
}

module.exports = {
    mapDays: mapDays
};

},{}],7:[function(require,module,exports){
'use strict';

/**
 * Returns true when given year is a leap year.
 *
 * @argument {Number} year
 *
 * @returns {Boolean}
 */
function isLeapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

module.exports = {
    isLeapYear: isLeapYear
};

},{}]},{},[1])(1)
});
//# sourceMappingURL=kalender-datepicker-angular.js.map
