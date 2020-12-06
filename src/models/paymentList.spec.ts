import * as dayjs from 'dayjs'
import { PaymentList } from './paymentList'

const createMoney = () => ({
  id: 382,
  mode: 'payment',
  user_id: 1,
  date: '2011-11-07',
  category_id: 101,
  genre_id: 10101,
  from_account_id: 34555,
  to_account_id: 0,
  comment: '',
  amount: 100,
  active: 1,
  name: '',
  receipt_id: 100293844,
  place: 'サブウェイ',
  place_uid: '',
  created: '2011-11-07 01:12:00',
  currency_code: 'JPY'
})

describe('filterBy', () => {
  const paymentList = new PaymentList([
    { ...createMoney(), id: 1, comment: '食費 私費' },
    { ...createMoney(), id: 2, comment: '私費 食費' },
    { ...createMoney(), id: 3, comment: '食費 私費 食費' },
    { ...createMoney(), id: 4, comment: 'キャリーオーバー 私費' },
    { ...createMoney(), id: 5, comment: '私費 キャリーオーバー' },
    { ...createMoney(), id: 6, comment: '小遣い キャリーオーバー 私費' },
    { ...createMoney(), id: 7, comment: '食費 公費' },
    { ...createMoney(), id: 8, comment: '食費 公費 食費' },
    { ...createMoney(), id: 9, comment: '公費 食費' }
  ])
  describe('私費で絞り込む', () => {
    test('キャリーオーバーを除く私費のみのオブジェクトが返ってくる', () => {
      const filteredPaymentList = paymentList.filterBy('private')

      expect(filteredPaymentList.payments.length).toBe(3)
      expect(filteredPaymentList.payments[0].id).toBe(1)
      expect(filteredPaymentList.payments[1].id).toBe(2)
      expect(filteredPaymentList.payments[2].id).toBe(3)
    })
  })
  describe('公費で絞り込む', () => {
    test('公費のみのオブジェクトが返ってくる', () => {
      const filteredPaymentList = paymentList.filterBy('public')
      expect(filteredPaymentList.payments.length).toBe(3)
      expect(filteredPaymentList.payments[0].id).toBe(7)
      expect(filteredPaymentList.payments[1].id).toBe(8)
      expect(filteredPaymentList.payments[2].id).toBe(9)
    })
  })
})

describe('totalAmount', () => {
  const paymentList = new PaymentList([
    { ...createMoney(), amount: 1000 },
    { ...createMoney(), amount: 2500 }
  ])
  test('合計金額が返ってくる', () => {
    expect(paymentList.totalAmount()).toBe(3500)
  })
})

describe('amountsByDate', () => {
  describe('支払いがある場合', () => {
    const paymentList = new PaymentList([
      { ...createMoney(), date: '2020-10-10', amount: 1000 },
      { ...createMoney(), date: '2020-10-10', amount: 2000 },
      { ...createMoney(), date: '2020-10-11', amount: 3000 },
      { ...createMoney(), date: '2020-10-11', amount: 4000 }
    ])
    test('日付ごとの合計金額が返ってくる', () => {
      const result = paymentList.amountsByDate(dayjs('2020-10-10'), dayjs('2020-10-11'))
      expect(result).toEqual({ '2020-10-10': 3000, '2020-10-11': 7000 })
    })
  })
  describe('支払いがない場合', () => {
    const paymentList = new PaymentList([])
    test('全ての日付が0で返ってくる', () => {
      const result = paymentList.amountsByDate(dayjs('2020-10-10'), dayjs('2020-10-11'))
      expect(result).toEqual({ '2020-10-10': 0, '2020-10-11': 0 })
    })
  })
})
