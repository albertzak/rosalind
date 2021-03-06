import { SimpleSchema } from 'meteor/aldeed:simple-schema'

const ExternalTimestamps = new SimpleSchema({
  importedAt: {
    type: Date,
    optional: true
  },

  importedBy: {
    type: SimpleSchema.RegEx.Id,
    optional: true
  },

  externalUpdatedAt: {
    type: Date,
    optional: true
  },

  externalCreatedAt: {
    type: Date,
    optional: true
  },

  externalRemovedAt: {
    type: Date,
    optional: true
  },

  externalUpdatedBy: {
    type: String,
    optional: true
  },

  externalCreatedBy: {
    type: String,
    optional: true
  },

  externalRemovedBy: {
    type: String,
    optional: true
  }
})

const ExternalNode = new SimpleSchema({
  timestamps: {
    type: ExternalTimestamps,
    optional: true
  },

  id: {
    type: String,
    index: 1,
    optional: true
  },

  hash: {
    type: String,
    optional: true,
    index: 1
  },

  patientId: {
    type: String,
    index: 1,
    optional: true
  },

  payload: {
    type: Object,
    blackbox: true,
    optional: true
  },

  note: {
    type: String,
    optional: true
  },

  removed: {
    type: Boolean,
    optional: true,
    index: 1
  }
})

const External = new SimpleSchema({
  eoswin: {
    optional: true,
    type: ExternalNode
  },

  inno: {
    optional: true,
    type: ExternalNode
  },

  auerPhone: {
    optional: true,
    type: ExternalNode
  },

  terminiko: {
    optional: true,
    type: ExternalNode
  },

  bioresonanz: {
    optional: true,
    type: ExternalNode
  }
})

export { External }
