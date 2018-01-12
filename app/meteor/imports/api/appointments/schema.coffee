import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Auto, External } from '../../util/schema'

Schema = new SimpleSchema
  calendarId:
    type: SimpleSchema.RegEx.Id,
    index: 1

  start:
    type: Date
    index: -1

  end:
    type: Date
    index: -1

  patientId:
    type: SimpleSchema.RegEx.Id
    optional: true
    index: 1

  assigneeId:
    type: SimpleSchema.RegEx.Id
    optional: true
    index: 1

  assistantIds:
    type: [SimpleSchema.RegEx.Id]
    optional: true

  tags:
    type: [SimpleSchema.RegEx.Id]
    optional: true

  note:
    type: String
    optional: true

  privateAppointment:
    type: Boolean
    defaultValue: false

  revenue:
    type: Number
    optional: true

  admittedAt:
    type: Date
    optional: true
    index: 1

  admittedBy:
    type: SimpleSchema.RegEx.Id
    optional: true
    index: 1

  treatedAt:
    type: Date
    optional: true
    index: 1

  treatedBy:
    type: SimpleSchema.RegEx.Id
    optional: true
    index: 1

  heuristic:
    type: Boolean
    optional: true
    index: 1

  external:
    optional: true
    type: External

  createdAt:
    type: Date
    autoValue: Auto.createdAt
    optional: true

  createdBy:
    type: SimpleSchema.RegEx.Id
    autoValue: Auto.createdBy
    optional: true

  removed:
    type: Boolean
    optional: true
    index: 1

  removedAt:
    type: Date
    optional: true

  removedBy:
    type: SimpleSchema.RegEx.Id
    optional: true

  canceled:
    type: Boolean
    optional: true
    index: 1

  canceledAt:
    type: Date
    optional: true

  canceledBy:
    type: SimpleSchema.RegEx.Id
    optional: true

  admitted:
    type: Boolean
    optional: true
    index: 1

  treated:
    type: Boolean
    optional: true
    index: 1

  # This field is TTL indexed
  # see collection.js for details
  lockedAt:
    type: Date
    optional: true

  lockedBy:
    type: SimpleSchema.RegEx.Id
    optional: true
    index: 1

Schema.i18n('appointments.form')

module.exports = Schema
