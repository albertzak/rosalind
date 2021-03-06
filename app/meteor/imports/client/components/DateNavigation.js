import React from 'react'
import moment from 'moment-timezone'
import { withRouter } from 'react-router-dom'
import { withTracker } from '../components/withTracker'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import { DayPickerSingleDateController } from 'react-dates'
import { PortalWithState } from 'react-portal'
import { __ } from '../../i18n'
import { Schedules } from '../../api/schedules'
import { dayToDate } from '../../util/time/day'
import { Icon } from './Icon'
import { skipForwards, skipBackwards } from '../../api/messages/methods/skipBackwards'

export const calendarStyle = {
  position: 'fixed',
  zIndex: 50,
  top: 50,
  right: 15,
  display: 'none'
}

export const calendarStyleOpen = {
  ...calendarStyle,
  display: 'block'
}

const composer = props => {
  const holidays = Schedules.find({
    type: 'holiday'
  }).fetch().map(h => moment(dayToDate(h.day)).format('YYYY-MM-DD')).sort()

  const isHoliday = m =>
    m.isoWeekday() === 7 ||
    holidays.includes(m.format('YYYY-MM-DD'))

  return {
    ...props,
    isHoliday
  }
}

class DateNavigationButtons extends React.Component {
  constructor (props) {
    super(props)

    this.goToDate = this.goToDate.bind(this)
    this.dateToPath = this.dateToPath.bind(this)
    this.handleBackwardMonthClick = this.handleBackwardMonthClick.bind(this)
    this.handleBackwardWeekClick = this.handleBackwardWeekClick.bind(this)
    this.handleBackwardDayClick = this.handleBackwardDayClick.bind(this)
    this.handleTodayClick = this.handleTodayClick.bind(this)
    this.handleForwardDayClick = this.handleForwardDayClick.bind(this)
    this.handleForwardWeekClick = this.handleForwardWeekClick.bind(this)
    this.handleForwardMonthClick = this.handleForwardMonthClick.bind(this)
    this.handleCalendarDayChange = this.handleCalendarDayChange.bind(this)
    this.isToday = this.isToday.bind(this)
    this.isSelected = this.isSelected.bind(this)
    this.initialVisibleMonth = this.initialVisibleMonth.bind(this)
  }

  dateToPath (date) {
    return `/${this.props.basePath}/${date.format('YYYY-MM-DD')}`
  }

  goToDate (date, nextOrPrevious = 'next') {
    const skip = m =>
      m.isoWeekday() === 7 ||
      this.props.isHoliday(m)

    let targetDay = date
    if (skip(targetDay)) {
      if (nextOrPrevious === 'next') {
        targetDay = skipForwards({ start: date, skip })
      } else {
        targetDay = skipBackwards({ start: date, skip })
      }
    }

    const path = this.dateToPath(targetDay)
    this.props.history.replace(path)
  }

  handleBackwardMonthClick () {
    this.goToDate(moment(this.props.date).subtract(1, 'month'), 'previous')
  }

  handleBackwardWeekClick () {
    this.goToDate(moment(this.props.date).subtract(1, 'week'), 'previous')
  }

  handleBackwardDayClick () {
    this.goToDate(moment(this.props.date).subtract(1, 'day'), 'previous')
  }

  handleTodayClick () {
    const path = this.dateToPath(moment())
    this.props.history.push(path)

    this.props.onTodayClick && this.props.onTodayClick()
  }

  handleForwardDayClick () {
    this.goToDate(moment(this.props.date).add(1, 'day'))
  }

  handleForwardWeekClick () {
    this.goToDate(moment(this.props.date).add(1, 'week'))
  }

  handleForwardMonthClick () {
    this.goToDate(moment(this.props.date).add(1, 'month'))
  }

  handleCalendarDayChange (date) {
    const path = this.dateToPath(moment(date))
    this.props.history.replace(path)
  }

  isToday (day) {
    return day.isSame(moment(), 'day')
  }

  isSelected (day) {
    return day.isSame(this.props.date, 'day')
  }

  initialVisibleMonth () {
    return this.props.date
  }

  render () {
    return (
      <div className={`breadcrumbs page-actions hide-print ${this.props.pullRight && 'pull-right'}`}>
        <PortalWithState
          closeOnEsc
          onClose={this.handleCalendarClose}>
          {
            ({ openPortal, closePortal, isOpen, portal }) =>
              <div>
                <ButtonGroup onMouseEnter={openPortal}>
                  {this.props.before}

                  {
                    this.props.jumpMonthBackward &&
                      <Button
                        onClick={this.handleBackwardMonthClick}
                        title={__('time.oneMonthBackward')}>
                        <Icon name='angle-left' />
                        <Icon name='angle-left' />
                      </Button>
                  }
                  {
                    this.props.jumpWeekBackward &&
                      <Button
                        onClick={this.handleBackwardWeekClick}
                        title={__('time.oneWeekBackward')}>
                        <Icon name='angle-double-left' />
                      </Button>
                  }

                  <Button
                    onClick={this.handleBackwardDayClick}
                    title={__('time.oneDayBackward')}>
                    <Icon name='caret-left' />
                  </Button>

                  <Button
                    onClick={this.handleTodayClick}>
                    {__('ui.today')}
                  </Button>

                  <Button
                    onClick={this.handleForwardDayClick}
                    title={__('time.oneDayForward')}>
                    <Icon name='caret-right' />
                  </Button>

                  {
                    this.props.jumpWeekForward &&
                      <Button
                        onClick={this.handleForwardWeekClick}
                        title={__('time.oneWeekForward')}>
                        <Icon name='angle-double-right' />
                      </Button>
                  }
                  {
                    this.props.jumpMonthForward &&
                      <Button
                        onClick={this.handleForwardMonthClick}
                        title={__('time.oneMonthForward')}>
                        <Icon name='angle-right' />
                        <Icon name='angle-right' />
                      </Button>
                  }

                </ButtonGroup>
                &nbsp;
                <ButtonGroup>
                  {
                    portal(
                      <div
                        className='hide-print'
                        style={isOpen ? calendarStyleOpen : calendarStyle}>
                        <div onMouseLeave={closePortal}>
                          <DayPickerSingleDateController
                            onDateChange={this.handleCalendarDayChange}
                            date={this.props.date}
                            isDayHighlighted={this.isToday}
                            isDayBlocked={this.props.isHoliday}
                            focused
                            initialVisibleMonth={this.initialVisibleMonth}
                            enableOutsideDays
                            hideKeyboardShortcutsPanel
                            numberOfMonths={1}
                          />
                        </div>
                      </div>
                    )
                  }

                  {
                    this.props.children && <div onMouseEnter={isOpen ? closePortal : null}>
                      {this.props.children}
                    </div>
                  }
                </ButtonGroup>
              </div>
          }
        </PortalWithState>
      </div>
    )
  }
}

export const DateNavigation = withRouter(withTracker(composer)(DateNavigationButtons))
