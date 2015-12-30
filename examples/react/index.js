;(function(React, classNames, kalender) {

    var WEEK_START = 1;
    var today = new Date();

    function isWeekendDay(day) {
        var SATURDAY_DAY_OF_WEEK = 6;
        var SUNDAY_DAY_OF_WEEK = 0;

        return (day.dayOfWeek === SATURDAY_DAY_OF_WEEK ||
            day.dayOfWeek === SUNDAY_DAY_OF_WEEK);
    }

    var Day = React.createClass({
        'isSelected': function() {
            if (typeof this.props.selection !== 'undefined') {
                return +this.props.selection === +this.props.day;
            } else {
                return false;
            }
        },

        'isToday': function() {
            var day = this.props.day;

            return day.getDate() === today.getDate() &&
                day.getMonth() === today.getMonth() &&
                day.getFullYear() === today.getFullYear();
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
            var k = kalender(this.state.month, WEEK_START);
            var weeks = (k.map(function(week) {
                var days = week.map(function(day) {
                    return (
                        <Day day={ day } 
                            month={ this.state.month }
                            selection={ this.state.selection }
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

    var initialSelection = new Date();

    React.render(<KalenderDatepicker selection={ initialSelection } />,
        document.getElementById('app'));

})(React, classNames, kalender);
