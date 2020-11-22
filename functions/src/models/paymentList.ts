import { Dayjs } from 'dayjs'
import { Money, PaymentType } from '../types'

export class PaymentList {
  constructor(private payments: Money[]) {}

  /**
   * 公費または私費で絞り込む
   */
  filterBy(type: PaymentType) {
    const paymentTypeComment = type === 'private' ? '私費' : '公費'
    this.payments = this.payments.filter(payment => payment.comment.indexOf(paymentTypeComment) >= 0)
    return this
  }

  /**
   * 合計金額を取得する
   */
  totalAmount() {
    return this.payments.reduce((total, payment) => total + payment.amount, 0)
  }

  /**
   * 金額を日別に集計する
   * { '2020-10-01': 1000, '2020-10-02': 2000, ... '2020-10-31': 3000}
   */
  amountsByDate(startDate: Dayjs, endDate: Dayjs) {
    // 開始から終了日までの日付一覧を連想配列化
    const amountTable: { [formattedDate: string]: number } = {}
    let iterateDate = startDate
    while (iterateDate.unix() <= endDate.unix()) {
      amountTable[iterateDate.format('YYYY-MM-DD')] = 0
      iterateDate = iterateDate.add(1, 'day')
    }

    // 支払い一覧から、連想配列に支払額を加算していく
    this.payments.forEach(payment => {
      if (amountTable[payment.date] !== undefined) {
        amountTable[payment.date] += payment.amount
      }
    })
    return amountTable
  }
}
