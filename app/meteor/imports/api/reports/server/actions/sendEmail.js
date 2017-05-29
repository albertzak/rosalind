import moment from 'moment-timezone'
import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Reports } from '../../'
import { Events } from '../../../events'
import { dateToDay } from '../../../../util/time/day'

export const sendEmail = new ValidatedMethod({
  name: 'reports/sendEmail',

  validate () {
    if (!process.env.MAIL_REPORTS_TO ||
    !process.env.MAIL_REPORTS_FROM ||
    !process.env.MAIL_URL) {
      throw new Meteor.Error('env-missing', 'Make sure to set all mail-related environment variables: MAIL_REPORTS_TO, MAIL_REPORTS_FROM, MAIL_URL')
    }
  },

  run () {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Not authorized')
    }

    const todaysReport = Reports.findOne({ day: dateToDay(moment()) })

    if (!todaysReport) {
      throw new Meteor.Error(404, 'There is no report for today, and no email will be sent')
    }

    const rendered = Reports.actions.renderEmail.call({ report: todaysReport })

    let to = 'me+TEST@albertzak.com'

    // if (process.env.NODE_ENV === 'production') {
    //   to = process.env.MAIL_REPORTS_TO.split(',')
    // }

    Email.send({
      from: process.env.MAIL_REPORTS_FROM,
      to,
      replyTo: process.env.MAIL_REPORTS_REPLYTO,
      subject: rendered.title,
      text: rendered.text
      // attachments: [
      //   {
      //     path: 'Report.pdf'
      //   }
      // ]
    })

    Events.post('reports/sendEmail', { reportId: todaysReport._id })
  }
})