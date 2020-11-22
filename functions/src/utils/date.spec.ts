import dayjs = require('dayjs')
import { dateRange } from './date'

describe('dateRange', () => {
  describe('2020-10-20 と 2020-10-23 を渡す', () => {
    it('20日、21日、22日、23日が返ってくる', () => {
      const result = dateRange(dayjs('2020-10-20'), dayjs('2020-10-23'))
      const formattedResult = result.map(r => r.format('YYYY-MM-DD'))
      expect(formattedResult).toEqual(['2020-10-20', '2020-10-21', '2020-10-22', '2020-10-23'])
    })
  })

  describe('2020-10-20 23:00:00 と 2020-10-21 14:00:00 を渡す', () => {
    it('20日、21日が返ってくる', () => {
      const result = dateRange(dayjs('2020-10-20 23:00:00'), dayjs('2020-10-21 14:00:00'))
      const formattedResult = result.map(r => r.format('YYYY-MM-DD'))
      expect(formattedResult).toEqual(['2020-10-20', '2020-10-21'])
    })
  })

  describe('2020-12-31 と 2021-01-01 を渡す', () => {
    it('2020-12-31 と 2021-01-01 が返ってくる', () => {
      const result = dateRange(dayjs('2020-12-31'), dayjs('2021-01-01'))
      const formattedResult = result.map(r => r.format('YYYY-MM-DD'))
      expect(formattedResult).toEqual(['2020-12-31', '2021-01-01'])
    })
  })
})
