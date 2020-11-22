import { config } from 'firebase-functions'
import { Money, MoneyType, PaymentType } from './types'
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
 * 支払いまたは収入の一覧をAPIから取得する
 */
const fetchMoneyList = async (startDate: Dayjs, endDate: Dayjs, mode: MoneyType) => {
  const responseData = await zaim.getMoney({
    start_date: startDate.format('YYYY-MM-DD'),
    end_date: endDate.format('YYYY-MM-DD'),
    mode: mode
  })
  return JSON.parse(responseData)['money'] as Money[]
}

/**
 * 支払いの一覧を取得し、必要に応じて公費または私費で絞り込む
 */
const fetchPaymentList = async (startDate: Dayjs, endDate: Dayjs, paymentType?: PaymentType) => {
  const payments = await fetchMoneyList(startDate, endDate, 'payment')
  const paymentList = new PaymentList(payments)
  if (paymentType === undefined) {
    return paymentList
  } else {
    return paymentList.filterBy(paymentType)
  }
}

/**
 * 公費または私費の総支払額を取得する
 */
const fetchTotalPaidAmount = async (startDate: Dayjs, endDate: Dayjs, paymentType?: PaymentType) => {
  const paymentList = await fetchPaymentList(startDate, endDate, paymentType)
  return paymentList.totalAmount()
}

/**
 * 今月の公費または私費の予算残額を取得する
 */
export const fetchCurrentBalance = async (year: number, month: number, paymentType?: PaymentType) => {
  const day = dayjs().year(year).month(month)
  const currentMonthFrom = day.startOf('month')
  const currentMonthTo = day.endOf('month')
  const totalPaidAmount = await fetchTotalPaidAmount(currentMonthFrom, currentMonthTo, paymentType)
  const budget = paymentType === 'private' ? PrivateBudget : PublicBudget
  return budget - totalPaidAmount
}

export const fetchDailyPaymentAmount = async (startDate: Dayjs, endDate: Dayjs) => {
  const allPaymentList = await fetchPaymentList(startDate, endDate)
  const privatePaymentList = allPaymentList.filterBy('private')
  const publicPaymentList = allPaymentList.filterBy('public')

  return {
    private: privatePaymentList.amountsByDate(startDate, endDate),
    public: publicPaymentList.amountsByDate(startDate, endDate)
  }
}
