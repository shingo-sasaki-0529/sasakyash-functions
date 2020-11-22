import { Money, PaymentType } from '../types'

export class PaymentList {
  constructor(private payments: Money[]) {}

  filterBy(type: PaymentType) {
    const paymentTypeComment = type === 'private' ? '私費' : '公費'
    this.payments = this.payments.filter(payment => payment.comment.indexOf(paymentTypeComment) >= 0)
    return this
  }

  totalAmount() {
    return this.payments.reduce((total, payment) => total + payment.amount, 0)
  }
}
