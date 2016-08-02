import moment from 'moment'
import 'moment-duration-format'
import { Meteor } from 'meteor/meteor'
import { TAPi18n } from 'meteor/tap:i18n'
import { composeWithTracker } from 'react-komposer'
import { Button } from 'react-bootstrap'
import { Icon } from 'client/ui/components/Icon'
import { Timesheets } from 'api/timesheets'

export const TimesheetSummary = ({ timesheets, tracking, sum, stopTracking, startTracking }) => (
  <div>
    {
      tracking
      ? <div>
        <p>{TAPi18n.__('timesheets.youAreWorking', moment.duration(sum).format('H[h] mm[m] ss[s]'))}</p>
        <Button bsStyle="warning" onClick={stopTracking}>
          <Icon name="pause" />&ensp;
          {TAPi18n.__('timesheets.pauseAction')}
        </Button>
      </div>
      : <div>
        <p>{TAPi18n.__('timesheets.youHaveWorkedToday', moment.duration(sum).format('H[h] mm[m] ss[s]'))}</p>
        <Button bsStyle="success" onClick={startTracking}>
          <Icon name="play" />&ensp;
          {TAPi18n.__('timesheets.resumeAction')}
        </Button>
      </div>
    }
  </div>
)

const composer = (props, onData) => {
  const { userId } = props
  const stopTracking = () => Timesheets.methods.stopTracking.call({ userId: Meteor.userId() })
  const startTracking = () => Timesheets.methods.startTracking.call({ userId: Meteor.userId() })

  const update = () => {
    const timesheets = Timesheets.find({
      userId,
      start: { $gt: moment().startOf('day').toDate() }
    }).fetch()
    const tracking = Timesheets.methods.isTracking.call({ userId })
    const sum = Timesheets.methods.sum.call({ userId })
    onData(null, { timesheets, tracking, sum, stopTracking, startTracking })
  }

  update()
  const tick = setInterval(update, 1000)
  const cleanup = () => clearInterval(tick)
  return cleanup
}

export const TimesheetSummaryContainer = composeWithTracker(composer)(TimesheetSummary)
