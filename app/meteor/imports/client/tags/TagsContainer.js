import sortBy from 'lodash/fp/sortBy'
import { withTracker } from '../components/withTracker'
import { Tags } from '../../api/tags'
import { Users } from '../../api/users'
import { Calendars } from '../../api/calendars'
import { TagsScreen } from './TagsScreen'

const sortByCalendar = sortBy(({ calendarIds }) =>
  (Calendars.findOne({ _id: { $in: calendarIds }}, { sortBy: { order: 1 } }) || {}).order
)

const composer = (props) => {
  const tags = sortByCalendar(Tags.find({}, { sort: { order: 1 } }).fetch())

  const getCalendarName = _id => _id && ((Calendars.findOne({ _id }) || {}).name)
  const getAssigneeName = _id => _id && Users.methods.fullNameWithTitle(Users.findOne({ _id }))
  const handleUpdate = (_id, update) => {
    Tags.update({ _id }, update)
  }

  return { tags, getCalendarName, getAssigneeName, handleUpdate }
}

export const TagsContainer = withTracker(composer)(TagsScreen)
