;(function (global) {

    function isWeekend(date) {
        var SATURDAY_INDEX = 6;
        var SUNDAY_INDEX = 0;

        return (date.getDay() === SATURDAY_INDEX ||
                date.getDay() === SUNDAY_INDEX);
    }

    function isSameDay(first, second) {
        return first.getDate() === second.getDate() &&
            first.getMonth() === second.getMonth() &&
            first.getFullYear() === second.getFullYear();
    }

    function prevMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() - 1);
    }

    function nextMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1);
    }

    /**
     *  Returns a RFC3339 date string.
     *
     *  A input[type=date] value should be a date string value according to:
     *  https://tools.ietf.org/html/rfc3339#section-5.6
     *
     *  @argument {Date} date
     *
     *  @returns RFC3339 date string, e.g. '2015-01-01'
     */
    function dateValue(date) {
        return date.getFullYear() + '-' +
            formatTwoDigits(date.getMonth() + 1) + '-' +
            formatTwoDigits(date.getDate());
    }

    function formatTwoDigits(number) {
        return ('00' + number).slice(-2);
    }

    function sortOldToNew(dates) {
        return [].concat(dates)
            .sort(function(first, second) {
                return +first - +second;
            });
    }

    global.util = {
        isWeekend: isWeekend,
        isSameDay: isSameDay,
        prevMonth: prevMonth,
        nextMonth: nextMonth,
        dateValue: dateValue,
        sortOldToNew: sortOldToNew
    };

})(window);
