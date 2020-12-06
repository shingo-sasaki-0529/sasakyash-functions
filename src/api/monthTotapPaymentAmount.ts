import * as functions from 'firebase-functions'
import { fetchPaymentList } from '../zaim'
import * as dayjs from 'dayjs'
const cors = require('cors')({ origin: true })

/**
 * monthTotalPaymentAmount API 指定月の総支払額を取得する
 * reponse { data: { private: 0, public: 0} }
 */
export default functions.https.onRequest(async (request, response) => {
  // リクエストパラメータを元に、集計対象期間を決定する
  const params = request?.body?.data || request?.query || {}
  const year = params.year ? Number(request.query.year) : dayjs().year()
  const month = params.month ? Number(request.query.month) - 1 : dayjs().month()
  const dateFrom = dayjs().year(year).month(month).startOf('month')
  const dateTo = dateFrom.endOf('month')

  // 対象期間の支出一覧をZaimAPIから取得する
  const paymentList = await fetchPaymentList(dateFrom, dateTo)

  // 私費と公費それぞれの合計金額を集計する
  const privateTotalAmount = paymentList.filterBy('private').totalAmount()
  const publicTotalAmount = paymentList.filterBy('public').totalAmount()

  // レスポンスを作成する
  cors(request, response, () => {
    response.json({
      data: {
        private: privateTotalAmount,
        public: publicTotalAmount
      }
    })
  })
})
