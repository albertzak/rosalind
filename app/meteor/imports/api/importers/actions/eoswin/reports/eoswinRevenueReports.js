import { Meteor } from 'meteor/meteor'
import { processRevenue, mapUserIds } from '../../../../reports/methods/external/eoswin'
import { Reports } from '../../../../reports'
import { Users } from '../../../../users'
import { action } from '../../../../../util/meteor/action'

export const eoswinRevenueReports = ({ Importers }) => {
  return action({
    name: 'importers/eoswinRevenueReports',
    args: {
      importer: { type: String, optional: true, allowedValues: [ 'eoswinRevenueReports' ] },
      name: { type: String },
      content: { type: String }
    },
    allowAnonymous: true,
    requireClientKey: true,
    fn ({ name, content }) {
      try {
        if (Meteor.isServer) {
          const { isTrustedNetwork } = require('../../../../customer/isTrustedNetwork')
          if (!this.userId && (this.connection && !isTrustedNetwork(this.connection.clientAddress))) {
            throw new Meteor.Error(403, 'Not authorized')
          }
        }

        const mapIds = mapUserIds({ Users })

        const addendum = processRevenue(mapIds)(content, name)
        Reports.actions.generate.call({ day: addendum.day, addendum })
      } catch (e) {
        console.error(e.message, e.stack)
        throw e
      }
    }
  })
}
