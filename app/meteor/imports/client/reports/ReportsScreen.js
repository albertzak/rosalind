import React from 'react'
import FlipMove from 'react-flip-move'
import moment from 'moment-timezone'
import { Button } from 'react-bootstrap'
import { TAPi18n } from 'meteor/tap:i18n'
import { weekOfYear } from '../../util/time/format'
import { dayToDate } from '../../util/time/day'
import { Icon } from '../components/Icon'
import { DateNavigation } from '../components/DateNavigation'
import { Box } from '../components/Box'
import { Report } from './Report'
import { Preview } from './Preview'
import { FooterContainer } from '../layout/FooterContainer'

export class ReportsScreen extends React.Component {
  constructor (props) {
    super(props)
    this.handlePrint = this.handlePrint.bind(this)
    this.handleToggleRevenue = this.handleToggleRevenue.bind(this)

    this.state = {
      showRevenue: props.canShowRevenue || false
    }
  }

  handlePrint () {
    if (window.native) {
      console.log('[Client] Printing: native')
      const title = moment(dayToDate(this.props.day))
        .format("YYYY-MM-DD-[#{TAPi18n.__('reports.thisDaySingular')}]")
      window.native.print({ title })
    } else {
      console.log('[Client] Printing: default')
      window.print()
    }
  }

  handleToggleRevenue () {
    this.setState({
      ...this.state,
      showRevenue: !this.state.showRevenue
    })
  }

  render () {
    return (
      <div>
        <div className='content-header show-print'>
          <h1 className='show-print'>
            {TAPi18n.__('reports.thisDaySingular')} {this.props.date.format(TAPi18n.__('time.dateFormatWeekday'))}&nbsp;
            <small>{weekOfYear(this.props.date, { short: true })}</small>
          </h1>
          <DateNavigation
            date={this.props.date}
            basePath='reports/day'
            pullRight
            jumpWeekBackward
            jumpMonthBackward
            jumpWeekForward
            jumpMonthForward>
            <Button onClick={this.handlePrint} title={TAPi18n.__('ui.print')}><Icon name='print' /></Button>
            {
              this.props.canShowRevenue &&
                <Button onClick={this.handleToggleRevenue} title={TAPi18n.__('reports.toggleRevenue')}><Icon name='euro' /></Button>
            }
          </DateNavigation>
        </div>
        <div className='content'>
          <div className='display-none show-print' style={{ width: '100%', height: 5 }} />
          <FlipMove duration={230}>
            {
              this.props.report
              ? <div key='reportTable'>
                <Report
                  report={this.props.report}
                  showRevenue={this.state.showRevenue}
                  mapUserIdToName={this.props.mapUserIdToName}
                  __={this.props.__}
                />
                <FooterContainer />
              </div>
              : <div key='noReports'>
                <Box type='warning' title={TAPi18n.__('ui.notice')}>
                  <p>{TAPi18n.__('reports.empty')}</p>
                </Box>
              </div>
            }
          </FlipMove>

          <FlipMove duration={230}>
            {
              this.props.preview &&
                <div key='previewTable'>
                  <Preview
                    preview={this.props.preview}
                    showRevenue={this.state.showRevenue}
                    mapUserIdToName={this.props.mapUserIdToName}
                    mapUserIdToUsername={this.props.mapUserIdToUsername}
                    __={this.props.__}
                  />
                  {/* Signals that the page has fully loaded when rendering PDF */}
                  <span className='weekPreviewLoaded' />
                </div>
            }
          </FlipMove>

          <div className='hide-print'>
            <Button onClick={this.props.generateReport}>
                Diesen Bericht neu generieren
            </Button>

            <Button onClick={this.props.viewAppointments}>
                Terminkalender für diesen Tag ansehen
            </Button>

            <Button onClick={this.props.sendEmailTest}>
                Test Email senden
            </Button>

            <Button onClick={this.props.sendEmail}>
                Email senden
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
