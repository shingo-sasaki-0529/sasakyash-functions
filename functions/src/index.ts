import * as functions from 'firebase-functions'
import { fetchCurrentBalance } from './zaim'
import * as dayjs from 'dayjs'

/**
 * 残額を取得する
 */
export const balance = functions.https.onRequest(async (request, response) => {
  const year = request.query.year ? Number(request.query.year) : dayjs().year()
  const month = request.query.month ? Number(request.query.month) - 1 : dayjs().month()
  const paymentType = request.query.paymentType === 'private' ? '私費' : '公費'
  const payments = await fetchCurrentBalance(year, month, paymentType)
  response.json({ data: payments })
})
