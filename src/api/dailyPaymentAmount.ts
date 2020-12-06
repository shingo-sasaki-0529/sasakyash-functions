import * as functions from 'firebase-functions'
import * as dayjs from 'dayjs'
import { fetchPaymentList } from '../zaim'
const cors = require('cors')({ origin: true })

/**
 * 指定月の日ごとの支払額を集計する
 * response { data: { date: ['2020-11-01', '2020-11-02', ...], amounts: [1000, 2000, ...] } }
 */
export default functions.https.onRequest(async (request, response) => {
  // リクエストパラメータを元に、集計対象期間を決定する
  const params = request?.body?.data || request?.query || {}
  const year = params.year || dayjs().year()
  const month = params.month ? params.month - 1 : dayjs().month()
  const paymentType = params.paymentType === 'private' ? 'private' : 'public'
  const dateFrom = dayjs().year(year).month(month).startOf('month')
  const dateTo = dateFrom.endOf('month')

  // 対象期間の支出一覧をZaimAPIから取得する
  const paymentList = await fetchPaymentList(dateFrom, dateTo)

  // リクエストに応じて、私費または公費で絞り込む
  const filteredPaymentList = paymentList.filterBy(paymentType)

  // 日別の総支払額を集計する
  const amountsByDate = filteredPaymentList.amountsByDate(dateFrom, dateTo)

  // レスポンスを作成する
  cors(request, response, () => {
    response.json({
      data: {
        days: Object.keys(amountsByDate),
        amounts: Object.values(amountsByDate)
      }
    })
  })
})
