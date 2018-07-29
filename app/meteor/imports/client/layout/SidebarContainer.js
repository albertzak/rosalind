import identity from 'lodash/identity'
import { withTracker } from '../components/withTracker'
import { withRouter } from 'react-router-dom'
import { process as server } from 'meteor/clinical:env'
import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Counts } from 'meteor/tmeasday:publish-counts'
import { Calendars } from '../../api/calendars'
import { Sidebar } from './Sidebar'

const sidebarItems = ({ history }) => {
  const calendars = Calendars.find({}, { sort: { order: 1 }}).fetch()

  return [
    {
      name: 'patients.thisNext',
      link: '/waitlist',
      icon: 'angle-right',
      roles: ['waitlist', 'waitlist-all', 'admin']
    },
    ...calendars.map(c => ({
      label: c.name,
      color: c.color,
      icon: c.icon,
      link: '/appointments/' + c.slug,
      slug: c.slug,
      roles: ['admin', 'appointments'],
      // replace calendar slug and keep selected date
      onClick: ({item, location}) => {
        const [base, _calendar, date] = location.pathname
          .split('/').filter(x => x.length > 0)

        const newPath =
          base === 'appointments'
          ? '/' + [base, item.slug, date].filter(identity).join('/')
          : item.link

        history.push(newPath)
      }
    })),
    {
      separator: true
    },
    {
      name: 'inboundCalls',
      icon: 'phone',
      roles: ['admin', 'inboundCalls'],
      countBadge: 'inboundCalls',
      subItems: [
        { name: 'thisOpen' },
        { name: 'thisResolved', path: '/resolved' },
        { name: 'thisNew', path: '/new' }
      ]
    },
    {
      name: 'schedules',
      icon: 'clock-o',
      roles: ['admin', 'schedules-edit'],
      subItems: [
        ...calendars.map(c => ({
          name: c.slug,
          label: c.name,
          path: '/default/' + c.slug,
          slug: c.slug
        })),
        { name: 'commonHolidays', path: '/holidays' },
        { name: 'constraints', path: '/constraints' }
      ]
    },
    {
      name: 'reports',
      icon: 'bar-chart',
      roles: ['admin', 'reports'],
      subItems: [
        { name: 'dashboard', path: '/day' },
        { name: 'assignees', path: '/assignee' },
        { name: 'referrals', path: '/referrals' }
      ]
    },
    {
      name: 'users',
      icon: 'unlock-alt',
      roles: ['admin', 'edit-users'],
      subItems: [
        { name: 'thisAll' },
        { name: 'thisNew', path: '/new' }
      ]
    },
    {
      name: 'patients',
      icon: 'user-plus',
      roles: ['admin', 'patients'],
      subItems: [
        { name: 'thisUpsert' }
      ]
    },
    {
      name: 'system',
      icon: 'server',
      roles: ['admin', 'system'],
      subItems: [
        { name: 'thisEvents', path: '/events' },
        { name: 'thisClients', path: '/clients' },
        { name: 'thisCalendars', path: '/calendars' },
        { name: 'thisTags', path: '/tags' },
        { name: 'thisMessages', path: '/messages' },
        { name: 'thisSettings', path: '/settings' },
        { name: 'thisImporters', path: '/importers' },
        { name: 'thisNative', path: '/native', only: () => window.native }
      ]
    }
  ]
}

const composer = (props) => {
  const items = sidebarItems(props).filter((item) => {
    return (!item.roles || item.roles && Roles.userIsInRole(Meteor.user(), item.roles))
  }).map((item) => {
    if (item.countBadge) {
      const count = Counts.get(item.countBadge)
      return { ...item, count }
    } else {
      return item
    }
  })

  const customerName = server.env.CUSTOMER_NAME || 'Rosalind Development'

  return { ...props, items, customerName }
}

export const SidebarContainer = withRouter(withTracker(composer)(Sidebar))
