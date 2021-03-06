import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Auto, Day, External } from '../../../util/schema'

export default new SimpleSchema({
  firstName: {
    type: String,
    optional: true
  },

  lastName: {
    type: String,
    optional: true
  },

  titlePrepend: {
    type: String,
    optional: true
  },

  titleAppend: {
    type: String,
    optional: true
  },

  birthday: {
    type: Day,
    optional: true
  },

  gender: {
    type: String,
    allowedValues: ['Male', 'Female'],
    optional: true
  },

  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_-]*$/
    // Meteor takes care of the index
  },

  groupId: {
    type: SimpleSchema.RegEx.Id,
    optional: true
  },

  lastLoginAt: {
    type: Date,
    optional: true
  },

  weakPassword: {
    type: Number,
    optional: true
  },

  employee: {
    type: Boolean,
    optional: true
  },

  hiddenInReports: {
    type: Boolean,
    optional: true
  },

  allowedClientIds: {
    type: [SimpleSchema.RegEx.Id],
    optional: true
  },

  createdAt: {
    type: Date,
    optional: true,
    autoValue: Auto.createdAt
  },

  external: {
    type: External,
    optional: true
  },

  services: {
    type: Object,
    optional: true,
    blackbox: true
  },

  roles: { // DEPRECATED
    type: Object,
    optional: true,
    blackbox: true
  },

  addedRoles: {
    type: [String],
    optional: true
  },

  removedRoles: {
    type: [String],
    optional: true
  },

  status: {
    type: Object,
    optional: true,
    blackbox: true
  },

  settings: {
    type: Object,
    optional: true,
    blackbox: true
  }
})
