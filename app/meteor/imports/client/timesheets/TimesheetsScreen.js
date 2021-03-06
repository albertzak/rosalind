import moment from 'moment-timezone'
import 'moment-duration-format'
import React from 'react'
import { __ } from '../../i18n'
import Button from 'react-bootstrap/lib/Button'
import { Icon } from '../components/Icon'
import { DateNavigation } from '../components/DateNavigation'
import { UserPicker } from '../users/UserPicker'
import { UserHelper } from '../users/UserHelper'
import { Box } from '../components/Box'
import { getClientKey, toNative } from '../../startup/client/native/events'

const Nil = () => (
  <span className='text-quite-muted'>&ndash;</span>
)

const End = ({ end, isToday }) => (
  <span>
    {
      end
        ? end.format('H:mm')
        : (isToday
          ? __('timesheets.now')
          : <Icon name='times-circle-o' />
        )
    }
  </span>
)

class TimesheetTableRow extends React.Component {
  render () {
    const { timesheet, scheduledHours } = this.props
    const start = moment(timesheet.start)
    const end = timesheet.end ? moment(timesheet.end) : undefined
    const isToday = moment().isSame(start, 'day')
    const duration = moment(end).diff(start)
    return (
      <tr>
        {/* date */}
        <td>{start.format('ddd')}</td>
        <td style={{ textAlign: 'right' }}>
          {start.format('D')}.&nbsp;
          <span className='text-muted'>{start.format('MMM YYYY')}</span>
        </td>

        {/* from-to */}
        <td style={{ textAlign: 'right' }}>{start.format('H:mm')}</td>
        <td className='text-muted'>-</td>
        <td><End {...{ end, isToday }} /></td>

        {/* scheduled */}
        <td className='text-muted' style={{ width: 120 }}>{scheduledHours && moment.duration(scheduledHours, 'hours').format(__('time.durationFormat'))}</td>

        {/* actual */}
        <td style={{ textAlign: 'right', width: 120 }}>
          {
            start && (end || isToday)
              ? moment.duration(duration).format(__('time.durationFormat'))
              : <Nil />
          }
        </td>
      </tr>
    )
  }
}

const TimesheetsTableHeader = () => (
  <thead>
    <tr>
      <th style={{ width: 10 }}>&nbsp;</th>
      <th style={{ width: 120, textAlign: 'right' }}>Datum</th>
      <th style={{ textAlign: 'right' }}>von</th>
      <th style={{ width: 5 }} className='text-muted'>-</th>
      <th>bis</th>
      <th>Geplant (soll)</th>
      <th style={{ textAlign: 'right' }}>Gesamt (ist)</th>
    </tr>
  </thead>
)

const TimesheetsTableBody = ({ days }) => (
  <tbody>
    {
      days.map((day) => (
        <TimesheetTableRow
          key={day.timesheet._id}
          timesheet={day.timesheet}
          scheduledHours={day.scheduledHours} />
      ))
    }
  </tbody>
)

export class TimesheetsScreen extends React.Component {
  constructor (props) {
    super(props)

    this.handlePrint = this.handlePrint.bind(this)
  }

  handlePrint () {
    if (getClientKey()) {
      console.log('[Client] Printing: native')
      const title = moment(this.props.start)
        .format("YYYY-MM-DD-[#{__('reports.thisDaySingular')}]")
      toNative('print', { title })
    } else {
      console.log('[Client] Printing: default')
      window.print()
    }
  }

  render () {
    const { days, sum, start, userId } = this.props
    return (
      <div>
        <div className='content-header'>
          <h1>
            {__('timesheets.this')}
          </h1>
          <DateNavigation date={this.props.start} basePath='schedules/timesheets' pullRight>
            <Button onClick={this.handlePrint} title={__('ui.print')}><Icon name='print' /></Button>
            {
              this.props.canShowRevenue &&
                <Button onClick={this.handleToggleRevenue} title={__('reports.showRevenue')}><Icon name='euro' /></Button>
            }
          </DateNavigation>
        </div>
        <div className='content'>
          <Box>
            <div style={{ width: 300 }}>
              <UserPicker
                onChange={this.props.onChangeUserId}
                value={this.props.userId} />
            </div>

            <h4>
              <UserHelper helper='fullNameWithTitle' userId={userId} /> hat im {moment(start).format('MMMM YYYY')} gesamt {moment.duration(sum).format(__('time.durationFormat'))} gearbeitet.
            </h4>

            <div className='table-responsive'>
              <table className='table no-margin'>
                <TimesheetsTableHeader />
                <TimesheetsTableBody days={days} />
              </table>
            </div>
          </Box>
        </div>
      </div>
    )
  }
}
