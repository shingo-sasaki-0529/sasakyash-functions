import monthTotalPaymentAmountAPI from './api/monthTotapPaymentAmount'
import DailyPaymentAmountsAPI from './api/dailyPaymentAmount'

export const monthTotalPaymentAmount = monthTotalPaymentAmountAPI

// 指定した年月の、日毎の支払金額を取得する
// response { data: { date: ['2020-11-01', '2020-11-02', ...], amounts: [1000, 2000, ...] } }
export const dailyPaymentAmounts = DailyPaymentAmountsAPI
