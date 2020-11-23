import { config } from 'firebase-functions'
import { Money, PaymentType } from './types'
import Zaim from 'zaim'
import * as dayjs from 'dayjs'
import { PaymentList } from './models/paymentList'

type Dayjs = dayjs.Dayjs
const Config = config().zaim
const PrivateBudget = Number(Config.private_budget)
const PublicBudget = Number(Config.public_budget)

const zaim = new Zaim({
  consumerKey: Config.key as string,
  consumerSecret: Config.secret as string,
  accessToken: Config.token as string,
  accessTokenSecret: Config.token_secret as string
})

/**
 * 支払い一覧をAPIから取得する
 */
export const fetchPaymentList = async (startDate: Dayjs, endDate: Dayjs) => {
  const responseData = await zaim.getMoney({
    start_date: startDate.format('YYYY-MM-DD'),
    end_date: endDate.format('YYYY-MM-DD'),
    mode: 'payment'
  })
  const rawPaymentList = JSON.parse(responseData)['money'] as Money[]
  return new PaymentList(rawPaymentList)
}

/**
 * 公費または私費の総支払額を取得する
 */
const fetchTotalPaidAmount = async (startDate: Dayjs, endDate: Dayjs, paymentType: PaymentType) => {
  const paymentList = await fetchPaymentList(startDate, endDate)
  return paymentList.totalAmount()
}

/**
 * 今月の公費または私費の予算残額を取得する
 */
export const fetchCurrentBalance = async (year: number, month: number, paymentType: PaymentType) => {
  const day = dayjs().year(year).month(month)
  const currentMonthFrom = day.startOf('month')
  const currentMonthTo = day.endOf('month')
  const totalPaidAmount = await fetchTotalPaidAmount(currentMonthFrom, currentMonthTo, paymentType)
  const budget = paymentType === 'private' ? PrivateBudget : PublicBudget
  return budget - totalPaidAmount
}

export const fetchDailyPaymentAmounts = async (
  startDate: Dayjs,
  endDate: Dayjs,
  paymentType: PaymentType
) => {
  const paymentList = await fetchPaymentList(startDate, endDate)
  const amountsByDate = paymentList.amountsByDate(startDate, endDate)
  return {
    days: Object.keys(amountsByDate),
    amounts: Object.values(amountsByDate)
  }
}
