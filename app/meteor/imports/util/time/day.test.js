/* eslint-env mocha */
import chai from 'chai'
import chaiDatetime from 'chai-datetime'
import day from './day'

const expect = chai.expect
chai.use(chaiDatetime)

describe('util', () => {
  describe('day', () => {
    context('converts regular', () => {
      const data = {
        date: new Date(2016, 5, 12),
        day: { year: 2016, month: 6, day: 12 }
      }

      it('day to date', () => {
        expect(day.dayToDate(data.day)).to.equalDate(data.date)
      })

      it('date to day', () => {
        expect(day.dateToDay(data.date)).to.eql(data.day)
      })

      it('day to date and back', () => {
        expect(day.dateToDay(day.dayToDate(data.day))).to.eql(data.day)
      })

      it('date to day and back', () => {
        expect(day.dayToDate(day.dateToDay(data.date))).to.equalDate(data.date)
      })
    })

    context('converts first', () => {
      const data = {
        date: new Date(2016, 0, 1),
        day: { year: 2016, month: 1, day: 1 }
      }

      it('day to date', () => {
        expect(day.dayToDate(data.day)).to.equalDate(data.date)
      })

      it('date to day', () => {
        expect(day.dateToDay(data.date)).to.eql(data.day)
      })

      it('day to date and back', () => {
        expect(day.dateToDay(day.dayToDate(data.day))).to.eql(data.day)
      })

      it('date to day and back', () => {
        expect(day.dayToDate(day.dateToDay(data.date))).to.equalDate(data.date)
      })
    })

    context('converts last', () => {
      const data = {
        date: new Date(2016, 11, 31),
        day: { year: 2016, month: 12, day: 31 }
      }

      it('day to date', () => {
        expect(day.dayToDate(data.day)).to.equalDate(data.date)
      })

      it('date to day', () => {
        expect(day.dateToDay(data.date)).to.eql(data.day)
      })

      it('day to date and back', () => {
        expect(day.dateToDay(day.dayToDate(data.day))).to.eql(data.day)
      })

      it('date to day and back', () => {
        expect(day.dayToDate(day.dateToDay(data.date))).to.equalDate(data.date)
      })
    })
  })
})
