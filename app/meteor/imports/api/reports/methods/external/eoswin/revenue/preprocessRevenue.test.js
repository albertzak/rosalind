/* eslint-env mocha */
import chai from 'chai'
import chaiDatetime from 'chai-datetime'
import { preprocessRevenue } from './preprocessRevenue'
import { REPORT } from '../report.fixture'

const expect = chai.expect
chai.use(chaiDatetime)

describe('api', function () {
  describe('reports', function () {
    describe('eoswin', function () {
      describe('parseAddendum with fixture', function () {
        const result = preprocessRevenue(REPORT)

        it('sums total revenue by assignee', function () {
          expect(result).to.eql({
            A5: 0,
            A6: 2.64,
            A11: 1024.27,
            A12: 36.58
          })
        })
      })
    })
  })
})