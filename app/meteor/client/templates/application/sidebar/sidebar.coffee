sidebar = [
  {} =
    name: 'appointments'
    icon: 'calendar'
    countBadge: 'appointments'
    roles: ['admin', 'appointments']
    submenu: [
      { name: 'thisOpen' }
      { name: 'thisAdmitted', route: '/appointments/:status', params: { status: 'admitted' }, reload: true }
      { name: 'thisTreating', route: '/appointments/:status', params: { status: 'treating' }, reload: true }
      { name: 'thisResolved' }
      { name: 'thisInsert' }
    ]

  {} =
    name: 'inboundCalls'
    icon: 'phone'
    countBadge: 'inboundCalls'
    roles: ['admin', 'inboundCalls']
    submenu: [
      { name: 'thisOpen' }
      { name: 'thisResolved' }
      { name: 'thisInsert' }
    ]

  {} =
    name: 'patients'
    icon: 'users'
    roles: ['admin', 'patients']
    submenu: [
      { name: 'thisAll' }
    ]

  {} =
    name: 'schedules'
    icon: 'user-md'
    roles: ['admin', 'schedules']
    submenu: [
      { name: 'thisDefault' }
    ]

  {} =
    name: 'reports'
    icon: 'bar-chart'
    roles: ['admin', 'reports']
    submenu: [
      { name: 'dashboard' }
    ]

  {} =
    name: 'users'
    icon: 'unlock-alt'
    roles: ['admin']
    submenu: [
      { name: 'thisAll' }
      { name: 'thisInsert' }
    ]
]

sidebar = _.map sidebar, (m) ->
  m.submenu = _.map m.submenu, (s) ->
    s.parent = m
    return s
  return m

window.sidebar = sidebar

Template.sidebar.helpers
  sidebar: -> sidebar

  name: ->
    if @submenu
      TAPi18n.__(@name + '.this')
    else
      TAPi18n.__ [Template.parentData().name, @name].join('.')

  toHtmlId: -> TAPi18n.__(@name + '.this').replace(/[^a-z]/ig, '-').toLowerCase()

  showNav: ->
    return true unless @roles
    return true if (@roles and Roles.userIsInRole(Meteor.user(), @roles))
    return false

Template.sidebar.events
  'click .treeview-menu': ->
    $('body').removeClass('sidebar-open')

  'click .level-0': ->
    route = [@name, @submenu[0].name].join('.')
    FlowRouter.go(FlowRouter.path(route))

  'click .level-1': ->
    if @route
      FlowRouter.go(@route, @params)
    else
      route = [@parent.name, @name].join('.')
      FlowRouter.go(FlowRouter.path(route))

    if @reload
      FlowRouter.reload()
