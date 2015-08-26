InboundCalls = new Mongo.Collection('inboundCalls');

InboundCalls.allow({
  insert() { return true; },
  update() { return true; }
});

var inboundCallsSchema = new SimpleSchema({
  firstName: {
    type: String,
    optional: true
  },
  lastName: {
    type: String
  },
  telephone: {
    type: String,
    optional: true
  },
  note: {
    type: String
  },
  privatePatient: {
    type: Boolean
  },
  createdAt: {
    type: Date,
    autoValue: Util.autoCreatedAt,
    optional: true,
    index: -1
  },
  createdBy: {
    type: String,
    autoValue: Util.autoCreatedBy,
    optional: true
  }
});

InboundCalls.helpers({
  privateOrInsurance: function() {
    return this.privatePatient ? TAPi18n.__('inboundCalls.private') : TAPi18n.__('inboundCalls.insurance');
  },
  unresolve: function() {
    return Spacebars.SafeString('<a class="unresolve">Markierung entfernen</a>');
  }
});

InboundCalls.Table = new Tabular.Table({
  name: 'ResolvedInboundCalls',
  collection: InboundCalls,
  columns: [
    {data: 'firstName', title: 'Vorname'},
    {data: 'lastName', title: 'Nachname'},
    {data: 'telephone', title: 'Telefon'},
    {data: 'note', title: 'Notiz'},
    {data: 'privatePatient', title: 'Privat', render(val, type, doc) { return doc.privateOrInsurance(); }},
    {data: 'createdAt', title: 'Angenommen', render(val, type, doc) { return moment(val).calendar(); }},
    {data: 'createdBy', title: 'von', render(val, type, doc) { return Helpers.getFirstName(val); }},
    {data: 'removedAt', title: 'Erledigt', render(val, type, doc) { return moment(val).calendar(); }},
    {data: 'removedBy', title: 'von', render(val, type, doc) { return Helpers.getFirstName(val); }},
    {tmpl: Meteor.isClient && Template.inboundCallsUnresolve }
  ],
  order: [[5, 'desc'], [7, 'desc']],
  sub: new SubsManager(),
  changeSelector: (selector, userId) => {
    selector.removed = true;
    return selector;
  }
});

Meteor.startup(() => {
  inboundCallsSchema.i18n('inboundCalls.form');
  InboundCalls.attachSchema(inboundCallsSchema);
  InboundCalls.attachBehaviour('softRemovable');
});
