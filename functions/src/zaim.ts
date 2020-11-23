import { config } from 'firebase-functions'
import { Money } from './types'
import Zaim from 'zaim'
import * as dayjs from 'dayjs'
import { PaymentList } from './models/paymentList'

type Dayjs = dayjs.Dayjs
const Config = config().zaim

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
