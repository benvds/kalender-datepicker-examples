;(function(React, classNames, kalender) {

    var KALENDER_OPTIONS = {
        weekStart: 1
    };

    function isWeekendDay(day) {
        var SATURDAY_DAY_OF_WEEK = 6;
        var SUNDAY_DAY_OF_WEEK = 0;

        return (day.dayOfWeek === SATURDAY_DAY_OF_WEEK ||
            day.dayOfWeek === SUNDAY_DAY_OF_WEEK);
    }

    var Day = React.createClass({
        'isSelected': function() {
            if (typeof this.props.selection !== 'undefined') {
                return kalender.day.isEqual(this.props.selection, this.props.day);
            } else {
                return false;
            }
        },

        'isWeekendDay': function() {
            var SATURDAY_DAY_OF_WEEK = 6;
            var SUNDAY_DAY_OF_WEEK = 0;
            var day = this.props.day;

            return (day.dayOfWeek === SATURDAY_DAY_OF_WEEK ||
                day.dayOfWeek === SUNDAY_DAY_OF_WEEK);
        },

        'setSelection': function() {
            this.props.onSelectionChange(this.props.day);
        },

        render: function() {
            var day = this.props.day;
            var classes = classNames('kalender-day', {
                'kalender-is-sibling-month': day.isSiblingMonth,
                'kalender-is-today': day.isToday,
                'kalender-is-weekend': this.isWeekendDay(),
                'kalender-is-selected': this.isSelected()
            });

            return (
                <td className={ classes } onClick={ this.setSelection }>{ day.day }</td>
            );
        }
    });

    var KalenderDatepicker = React.createClass({
        'currentMonth': function() {
            this.setState({
                month: {
                    year: (new Date()).getFullYear(),
                    month: 1 + (new Date()).getMonth()
                }
            });
        },

        'previousMonth': function() {
            this.setState({
                month: kalender.month.previousMonth(this.state.month)
            });
        },

        'nextMonth': function() {
            this.setState({
                month: kalender.month.nextMonth(this.state.month)
            });
        },

        handleSelectionChange: function(day) {
            this.setState({
                selection: day
            });
        },

        getInitialState: function() {
            return {
                month: this.props.selection,
                selection: this.props.selection
            };
        },

        render: function() {
            var weeks = kalender.calendar(this.state.month, KALENDER_OPTIONS).map(function(week) {
                var days = week.map(function(day) {
                    return (
                        <Day day={ day } selection={ this.state.selection } onSelectionChange={ this.handleSelectionChange } />
                    );
                }.bind(this));

                return (
                    <tr>{ days }</tr>
                );
            }.bind(this));

            return (
                <div className="kalender">
                    <button type="button" className="kalender-previous-month" onClick={ this.previousMonth }>previous</button>
                    <button type="button" className="kalender-current-month" onClick={ this.currentMonth }>current</button>
                    <button type="button" className="kalender-next-month" onClick={ this.nextMonth }>next</button>
                    <table className="kalender-calendar">
                        <thead>
                            <caption className="kalender-calendar-title">{ this.state.month.year } – { this.state.month.month }</caption>
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

    var initialSelection = {
        year: 2015,
        month: 6,
        day: 5
    };

    React.render(<KalenderDatepicker selection={ initialSelection } />,
        document.getElementById('app'));

})(React, classNames, kalender);