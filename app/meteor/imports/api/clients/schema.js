import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import Auto from '../../util/schema/auto'

export const schema = new SimpleSchema({
  clientKey: {
    type: String,
    min: 200,
    index: 1
  },

  isBanned: {
    type: Boolean,
    optional: true
  },

  description: {
    type: String,
    optional: true
  },

  passwordlessGroupIds: {
    type: [SimpleSchema.RegEx.Id],
    optional: true
  },

  lastActionBy: {
    type: SimpleSchema.RegEx.Id,
    optional: true
  },

  lastActionAt: {
    type: Date,
    optional: true
  },

  // used in Accounts.validateLoginAttempt for restricting user.allowedClientIds because we cannot pass additional arguments to loginWithPassword. When this matches the connection id of the login call, we assume the login came from this client.
  connectionId: {
    type: String,
    optional: true
  },

  settings: {
    type: Object,
    blackbox: true,
    optional: true
  },

  systemInfo: {
    type: Object,
    blackbox: true,
    optional: true
  },

  pairingAllowed: {
    type: Boolean,
    optional: true
  },

  pairingToken: {
    type: String,
    min: 90,
    optional: true
  },

  pairingTokenCreatedAt: {
    type: Date,
    optional: true
  },

  pairingTokenCreatedBy: {
    type: SimpleSchema.RegEx.Id,
    optional: true
  },

  // Many producers (cameras, scanners) can be paired to one consumer (workstation)
  pairedTo: {
    type: SimpleSchema.RegEx.Id,
    optional: true
  },

  pairedAt: {
    type: Date,
    optional: true
  },

  pairedBy: {
    type: SimpleSchema.RegEx.Id,
    optional: true
  },

  // Holds various attributes (patientId, appointmentId, cycle, tagIds) to be added to any future medias created by connected producers.
  // Set by this client's frontend patient modal controller.
  // Read by this client's connected producers (cameras/scanners).
  nextMedia: {
    type: Object,
    blackbox: true,
    optional: true
  },

  createdAt: {
    type: Date,
    autoValue: Auto.createdAt
  }
})
