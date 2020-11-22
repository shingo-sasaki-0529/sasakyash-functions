import BalanceAPI from './api/balance'
import DailyPaymentAmountsAPI from './api/dailyPaymentAmount'

// 残予算を取得する
// reponse { data: { private: 0, public: 0} }
export const balance = BalanceAPI
export const dailyPaymentAmounts = DailyPaymentAmountsAPI
