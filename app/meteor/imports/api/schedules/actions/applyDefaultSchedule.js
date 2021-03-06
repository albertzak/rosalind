import moment from 'moment-timezone'
import { Meteor } from 'meteor/meteor'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Events } from '../../events'
import { transformDefaultsToOverrides } from '../methods/transformDefaultsToOverrides'
import { rangeToDays, isSame, daySelector } from '../../../util/time/day'
import { hasRole } from '../../../util/meteor/hasRole'

export const applyDefaultSchedule = ({ Schedules }) => {
  return new ValidatedMethod({
    name: 'schedules/applyDefaultSchedule',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
      calendarId: { type: SimpleSchema.RegEx.Id },
      assigneeIds: { type: [SimpleSchema.RegEx.Id], optional: true },
      from: { type: Date },
      to: { type: Date }
    }).validator(),

    run ({ calendarId, assigneeIds, from, to }) {
      if ((this.connection && !this.userId) ||
        !hasRole(this.userId, ['admin', 'schedules-edit'])) {
        throw new Meteor.Error(403, 'Not authorized')
      }

      if (to < from) {
        throw new Meteor.Error(400, 'Swap to and from dates')
      }

      if (to <= new Date() || from <= new Date()) {
        throw new Meteor.Error(400, 'Dates must be in the future')
      }

      if (this.isSimulation) { return }

      const holidays = Schedules.find({
        type: 'holiday',
        start: {
          $gte: new Date()
        }
      }).fetch()

      const excludeHolidays = d => !holidays.find(h => isSame(d, h.day))

      const days = rangeToDays({ from, to }).filter(excludeHolidays)

      // Remove all overrides in selected period
      const oldOverridesSelector = {
        type: 'override',
        calendarId,
        start: {
          $gte: moment(from).startOf('day').toDate()
        },
        end: {
          $lte: moment(to).endOf('day').toDate()
        }
      }

      if (assigneeIds) {
        oldOverridesSelector.userId = { $in: assigneeIds }
      }

      const countRemovedOverrides = Schedules.remove(oldOverridesSelector)
      console.log('[Schedules] applyDefaultSchedule: Removed', countRemovedOverrides, 'override schedules')

      // Remove all day schedules in selected period
      if (assigneeIds) {
        console.log('[Schedules] applyDefaultSchedule: Warning: Skipping removing day schedules')
      } else {
        const countRemovedDays = Schedules.remove({
          type: 'day',
          calendarId,
          $or: days.map(d => daySelector(d)) // force 1-arity to prevent map index from being set as prefix
        })
        console.log('[Schedules] applyDefaultSchedule: Removed', countRemovedDays, 'day schedules')
      }

      // Create new overrides from schedules
      const defaultSchedules = Schedules.find({
        type: 'default',
        calendarId
      }).fetch()

      const overrideSchedules = transformDefaultsToOverrides({ defaultSchedules, days })

      // NB: Applying schedules for a single assignee only has an effect if the
      // same assignee is already present in the day schedule
      const ids = overrideSchedules.filter(s =>
        assigneeIds
          ? (s.type === 'override' && assigneeIds.indexOf(s.userId) !== -1)
          : true
      ).map(s => {
        const id = Schedules.insert(s)
        console.log('Inserted', id, s)
      })

      console.log('[Schedules] applyDefaultSchedule: Inserted', ids.length, 'override and day schedules from', defaultSchedules.length, 'default schedules')

      Events.post('schedules/applyDefaultSchedule', {
        calendarId,
        from,
        to,
        assigneeIds,
        userId: this.userId
      })

      return true
    }
  })
}
