;(function($, kalender) {

    var PLUGIN_NAME = 'kalenderDatepicker';
    var SELECTOR = '.kalender-datepicker';
    var WEEK_START = 1;
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

    var KalenderDatepicker = function (element, options) {
        this.options = options || {};
        this.selection = this.options.selection;
        this.highlights = this.options.highlights || [];
        this.$element = $(element);
        this.month = new Date();
        this.render();
    };

    KalenderDatepicker.prototype = {
        'isSelected': function(day) {
            if (typeof this.selection !== 'undefined') {
                return util.isSameDay(new Date(this.selection), day);
            } else {
                return false;
            }
        },

        'isHighlighted': function(day) {
            return this.highlights.some((highlight) => {
                return util.isSameDay(day, new Date(highlight));
            });
        },

        'isInBetween': function(day) {
            return util.isInBetween(
                    this.highlights.map((d) => new Date(d)),
                    day);
        },

        'currentMonth': function() {
            this.month = new Date();
            this.render();
        },

        'previousMonth': function() {
            this.month = util.prevMonth(this.month);
            this.render();
        },

        'nextMonth': function() {
            this.month = util.nextMonth(this.month);
            this.render();
        },

        'setSelection': function(day) {
            this.selection = day;
            this.render();
        },

        'render': function () {
            var calendar = kalender(this.month, WEEK_START);
            var $weeks = calendar.map(function(week) {
                return this.createWeekElement(week);
            }.bind(this));

            this.$element.html(BASE_TEMPLATE);
            this.$element.find('.kalender-calendar').append($weeks);
            this.$element.find('.kalender-year').text(this.month.getFullYear());
            this.$element.find('.kalender-month').text(this.month.getMonth() + 1);

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
                .text(day.getDate())
                .addClass(this.dayElementClasses(day))
                .on('click', function() {
                    this.setSelection(day);
                }.bind(this));
        },

        'dayElementClasses': function(day) {
            var elementClasses = ['kalender-day'];

            if (day.getMonth() !== this.month.getMonth()) {
                elementClasses.push('kalender-is-sibling-month');
            }

            if (util.isSameDay(new Date(), day)) {
                elementClasses.push('kalender-is-today');
            }

            if (util.isWeekend(day)) {
                elementClasses.push('kalender-is-weekend');
            }

            if (this.isSelected(day)) {
                elementClasses.push('kalender-is-selected');
            }

            if (this.isHighlighted(day)) {
                elementClasses.push('kalender-is-highlighted');
            }

            if (this.isInBetween(day)) {
                elementClasses.push('kalender-is-in-between');
            }

            return elementClasses.join(' ');
        }
    };

    $.fn[PLUGIN_NAME] = function () {
        var options = {};

        return this.each(function () {
            var selection = $(this).data('selection');
            var highlights = $(this).data('highlights');

            options = $.extend({}, {
                selection: selection,
                highlights: highlights
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
