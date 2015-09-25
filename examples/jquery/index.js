;(function($, kalender) {

    var PLUGIN_NAME = 'kalenderDatepicker';
    var SELECTOR = '.kalender-datepicker';
    var KALENDER_OPTIONS = {
        weekStart: 1
    };
    var BASE_TEMPLATE = '' +
        '<div class="kalender">' +
            '<button type="button" class="kalender-previous-month"">previous</button>' +
            '<button type="button" class="kalender-current-month"">current</button>' +
            '<button type="button" class="kalender-next-month">next</button>' +
            '<table class="kalender-calendar">' +
                '<caption class="kalender-calendar-title">' +
                    '<span class="kalender-year"></span> – <span class="kalender-month"></span>' +
                '</caption>' +
                '<tr class="weekday-headings">' +
                    '<th>mon</th>' +
                    '<th>tue</th>' +
                    '<th>wed</th>' +
                    '<th>thu</th>' +
                    '<th>fri</th>' +
                    '<th>sat</th>' +
                    '<th>sun</th>' +
                '</tr>' +
            '</table>' +
        '</div>';

    function isWeekendDay(day) {
        var SATURDAY_DAY_OF_WEEK = 6;
        var SUNDAY_DAY_OF_WEEK = 0;

        return (day.dayOfWeek === SATURDAY_DAY_OF_WEEK ||
            day.dayOfWeek === SUNDAY_DAY_OF_WEEK);
    }
    
    var KalenderDatepicker = function (element, options) {
        this.options = options || {};
        this.selection = this.options.selection;
        this.$element = $(element);
        this.currentMonth();
    };

    KalenderDatepicker.prototype = {
        'currentMonth': function() {
            this.month = {
                year: (new Date()).getFullYear(),
                month: 1 + (new Date()).getMonth()
            };
            this.render();
        },

        'isSelected': function(day) {
            if (typeof this.selection !== 'undefined') {
                return kalender.day.isEqual(this.selection, day);
            } else {
                return false;
            }
        },

        'previousMonth': function() {
            this.month =
                kalender.month.previousMonth(this.month);
            this.render();
        },

        'nextMonth': function() {
            this.month =
                (new kalender.Month(this.month)).next().days()[0];
            this.render();
        },

        'setSelection': function(day) {
            this.selection = day;
            this.render();
        },

        'render': function () {
            var calendar = kalender.calendar(this.month, KALENDER_OPTIONS);
            var $weeks = calendar.map(function(week) {
                return this.createWeekElement(week);
            }.bind(this));

            this.$element.html(BASE_TEMPLATE);
            this.$element.find('.kalender-calendar').append($weeks);
            this.$element.find('.kalender-year').text(this.month.year);
            this.$element.find('.kalender-month').text(this.month.month);

            // TODO cleanup, probably will leak memory
            this.$element.find('.kalender-previous-month').on('click', this.previousMonth.bind(this));
            this.$element.find('.kalender-current-month').on('click', this.currentMonth.bind(this));
            this.$element.find('.kalender-next-month').on('click', this.nextMonth.bind(this));
        },

        'createWeekElement': function(week) {
            var $days = week.map(function(day) {
                return this.createDayElement(day);
            }.bind(this));

            return $('<tr></tr>').append($days);
        },

        // TODO cleanup, probably will leak memory
        'createDayElement': function(day) {
            return $('<td></td>')
                .text(day.day)
                .addClass(this.dayElementClasses(day))
                .on('click', function() {
                    this.setSelection(day);
                }.bind(this));
        },

        'dayElementClasses': function(day) {
            var elementClasses = ['kalender-day'];

            if (day.isSiblingMonth) {
                elementClasses.push('kalender-is-sibling-month');
            }

            if (day.isToday) {
                elementClasses.push('kalender-is-today');
            }

            if (isWeekendDay(day)) {
                elementClasses.push('kalender-is-weekend');
            }

            if (this.isSelected(day)) {
                elementClasses.push('kalender-is-selected');
            }

            return elementClasses.join(' ');
        }
    };

    $.fn[PLUGIN_NAME] = function () {
        var options;

        return this.each(function () {
            options = $.extend({}, {
                selection: $(this).data('selection')
            });

            if (!$.data(this, 'plugin-' + PLUGIN_NAME)) {
                $.data(this, 'plugin-' + PLUGIN_NAME,
                       new KalenderDatepicker(this, options));
            }
        });
    };

    // on document load
    $(function() {
        $(SELECTOR)[PLUGIN_NAME]();
    });

})(jQuery, kalender);
