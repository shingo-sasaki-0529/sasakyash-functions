import { config } from 'firebase-functions'
import { Money } from './types'
import Zaim from 'zaim'
import * as dayjs from 'dayjs'
import db from './store'
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
  // Zaim API 用のパラメータを組み立てる
  const params = {
    start_date: startDate.format('YYYY-MM-DD'),
    end_date: endDate.format('YYYY-MM-DD'),
    mode: 'payment' as 'payment'
  }
  const serializedParams = JSON.stringify(params)

  // キャッシュがある場合はそれをモデル化してそのまま返却する
  const cachedData = await db.read('zaim-get-money-cache', serializedParams)
  if (cachedData) {
    return new PaymentList(cachedData)
  }

  // キャッシュがないので Zaim API を呼び出し、レスポンスをパースする
  const responseData = await zaim.getMoney(params)
  const rawPaymentList = JSON.parse(responseData)['money'] as Money[]

  // キャッシュを新規作成する
  await db.write('zaim-get-money-cache', serializedParams, rawPaymentList)

  // モデル化して返却する
  return new PaymentList(rawPaymentList)
}
