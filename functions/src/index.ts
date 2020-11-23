import BalanceAPI from './api/balance'
import DailyPaymentAmountsAPI from './api/dailyPaymentAmount'

// 残予算を取得する
// reponse { data: { private: 0, public: 0} }
export const balance = BalanceAPI

// 指定した年月の、日毎の支払金額を取得する
// response { data: { date: ['2020-11-01', '2020-11-02', ...], amounts: [1000, 2000, ...] } }
export const dailyPaymentAmounts = DailyPaymentAmountsAPI
