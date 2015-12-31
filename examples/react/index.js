;(function(React, classNames, kalender, util) {

    var WEEK_START = 1;
    var today = new Date();


    var Day = React.createClass({
        'isSelected': function() {
            return this.props.selection &&
                util.isSameDay(this.props.selection, this.props.day);
        },

        'isToday': function() {
            return util.isSameDay(this.props.day, today);
        },

        'isWeekendDay': function() {
            return util.isWeekend(this.props.day);
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
                month: util.prevMonth(this.state.month)
            });
        },

        'nextMonth': function() {
            this.setState({
                month: util.nextMonth(this.state.month)
            });
        },

        handleSelectionChange: function(date) {
            this.props.onChange(util.dateValue(date));
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

    var KalenderExample = React.createClass({
        getInitialState: function() {
            return {
                date: util.dateValue(new Date())
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

})(React, classNames, kalender, util);
