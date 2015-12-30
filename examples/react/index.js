;(function(React, classNames, kalender) {

    var WEEK_START = 1;
    var today = new Date();

    function isWeekendDay(day) {
        var SATURDAY_DAY_OF_WEEK = 6;
        var SUNDAY_DAY_OF_WEEK = 0;

        return (day.dayOfWeek === SATURDAY_DAY_OF_WEEK ||
            day.dayOfWeek === SUNDAY_DAY_OF_WEEK);
    }

    function isSameDay(first, second) {
        return first.getDate() === second.getDate() &&
            first.getMonth() === second.getMonth() &&
            first.getFullYear() === second.getFullYear();
    }

    var Day = React.createClass({
        'isSelected': function() {
            return this.props.selection &&
                isSameDay(this.props.selection, this.props.day);
        },

        'isToday': function() {
            return isSameDay(this.props.day, today);
        },

        'isWeekendDay': function() {
            var SATURDAY_DAY_OF_WEEK = 6;
            var SUNDAY_DAY_OF_WEEK = 0;
            var day = this.props.day;

            return (day.getDay() === SATURDAY_DAY_OF_WEEK ||
                day.getDay() === SUNDAY_DAY_OF_WEEK);
        },

        'isOtherMonth': function() {
            return this.props.day.getMonth() !== this.props.month.getMonth();
        },

        'setSelection': function() {
            this.props.onSelectionChange(this.props.day);
        },

        render: function() {
            var day = this.props.day;
            var classes = classNames('kalender-day', {
                'kalender-is-sibling-month': this.isOtherMonth(),
                'kalender-is-today': this.isToday(),
                'kalender-is-weekend': this.isWeekendDay(),
                'kalender-is-selected': this.isSelected()
            });

            return (
                <td className={ classes } onClick={ this.setSelection }>{ day.getDate() }</td>
            );
        }
    });

    var KalenderDatepicker = React.createClass({
        'currentMonth': function() {
            this.setState({
                month: new Date()
            });
        },

        'previousMonth': function() {
            this.setState({
                month: new Date(this.state.month.getFullYear(),
                               this.state.month.getMonth() - 1)
            });
        },

        'nextMonth': function() {
            this.setState({
                month: new Date(this.state.month.getFullYear(),
                               this.state.month.getMonth() + 1)
            });
        },

        handleSelectionChange: function(date) {
            this.props.onChange(dateValue(date));
        },

        getInitialState: function() {
            return {
                month: new Date(this.props.selection)
            };
        },

        render: function() {
            var k = kalender(this.state.month, WEEK_START);
            var selectionDate = new Date(this.props.selection);

            var weeks = (k.map(function(week) {
                var days = week.map(function(day) {
                    return (
                        <Day day={ day } 
                            month={ this.state.month }
                            selection={ selectionDate }
                            onSelectionChange={ this.handleSelectionChange } />
                    );
                }.bind(this));

                return (
                    <tr>{ days }</tr>
                );
            }.bind(this)));

            return (
                <div className="kalender">
                    <button type="button" className="kalender-previous-month" onClick={ this.previousMonth }>previous</button>
                    <button type="button" className="kalender-current-month" onClick={ this.currentMonth }>current</button>
                    <button type="button" className="kalender-next-month" onClick={ this.nextMonth }>next</button>
                    <table className="kalender-calendar">
                        <thead>
                            <caption className="kalender-calendar-title">{ this.state.month.getFullYear() } – { this.state.month.getMonth() + 1 }</caption>
                            <tr>
                               <th>mon</th>
                               <th>tue</th>
                               <th>wed</th>
                               <th>thu</th>
                               <th>fri</th>
                               <th>sat</th>
                               <th>sun</th>
                            </tr>
                        </thead>
                        <tbody>
                            { weeks }
                        </tbody>
                    </table>
                </div>
            );
        }
    });

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

    var KalenderExample = React.createClass({
        getInitialState: function() {
            return {
                date: dateValue(new Date())
            };
        },

        handleInput: function(event) {
            this.setState({ date: event.target.value });
        },

        handleChange: function(date) {
            this.setState({ date: date });
        },

        render: function() {
            var value = this.state.date;

            return (
                <form name="date-form">
                    <p><input type="date" name="selection-date" value={ value } onInput={ this.handleInput } /></p>
                    <p><KalenderDatepicker selection={ value } onChange={ this.handleChange } /></p>
                </form>
            );
        }
    });

    React.render(<KalenderExample />,
        document.getElementById('app'));

})(React, classNames, kalender);
