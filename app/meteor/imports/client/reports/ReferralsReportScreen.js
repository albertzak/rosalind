import React from 'react'
import moment from 'moment-timezone'
import { Button } from 'react-bootstrap'
import { TAPi18n } from 'meteor/tap:i18n'
import { dayToDate } from '../../util/time/day'
import { Icon } from '../components/Icon'
import { Loading } from '../components/Loading'
import { PrintSettings } from './shared/PrintSettings'
import { DateRangeNavigation } from '../components/DateRangeNavigation'
import { Box } from '../components/Box'
import { ReferralsDetailTable } from './ReferralsDetailTable'
import { UserPickerContainer } from '../users/UserPickerContainer'
import { fullNameWithTitle } from '../../api/users/methods/name'

const formatRange = ({ start, end }) =>
  ([
    moment(start).format(TAPi18n.__('time.dateFormatShortNoYear')),
    '-',
    moment(end).format(TAPi18n.__('time.dateFormatShort'))
  ].join(' '))

export class ReferralsReportScreen extends React.Component {
  constructor (props) {
    super(props)
    this.handlePrint = this.handlePrint.bind(this)
  }

  handlePrint () {
    if (window.native) {
      console.log('[Client] Printing: native')
      const title = moment(dayToDate(this.props.day))
        .format(`YYYY-MM-DD-[${TAPi18n.__('reports.thisDaySingular')}]`)
      window.native.print({ title })
    } else {
      console.log('[Client] Printing: default')
      window.print()
    }
  }

  render () {
    const {
      isLoading,
      from,
      to,
      user,
      referrals,
      handleRangeChange,
      handleChangeAssignee,
      mapUserIdToName,
      mapReportAsToHeader
    } = this.props

    const formattedRange = formatRange({
      start: from,
      end: to
    })

    const title = user &&
      TAPi18n.__('reports.referralsReportFor', {
        name: fullNameWithTitle(user)
      }) || TAPi18n.__('reports.referralsReport')

    return (
      <div>
        <PrintSettings orientation='portrait' />

        <div className='content-header show-print'>
          <h1 className='show-print'>
            {title}
            <small className='hide-screen'>{formattedRange}</small>
          </h1>

          <DateRangeNavigation
            start={from}
            end={to}
            onRangeChange={handleRangeChange}
            calendarText={formattedRange}
            pullRight>
            <Button onClick={this.handlePrint} title={TAPi18n.__('ui.print')}><Icon name='print' /></Button>
          </DateRangeNavigation>
        </div>
        <div className='content'>
          <div className='hide-print' style={{ paddingBottom: 15 }}>
            <UserPickerContainer
              autoFocus
              onChange={handleChangeAssignee} />
          </div>
          <div className='display-none show-print' style={{ width: '100%', height: 5 }} />
          {
            !user
            ? <Box type='info' title={TAPi18n.__('ui.notice')}>
              <p>{TAPi18n.__('reports.emptySelectAssignee')}</p>
            </Box>
            : isLoading
            ? <Loading />
            : (referrals && referrals.length > 0)
            ? <ReferralsDetailTable
                referrals={referrals}
                mapUserIdToName={mapUserIdToName}
              />
            : <div key='noReports'>
              <Box type='info' title={TAPi18n.__('ui.notice')}>
                <p>{TAPi18n.__('reports.emptyAssignee')}</p>
              </Box>
            </div>
          }
        </div>
      </div>
    )
  }
}
