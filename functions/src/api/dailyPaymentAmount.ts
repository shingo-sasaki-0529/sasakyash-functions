import * as functions from 'firebase-functions'
import * as dayjs from 'dayjs'
import { fetchDailyPaymentAmounts } from '../zaim'
const cors = require('cors')({ origin: true })

export default functions.https.onRequest(async (request, response) => {
  const params = request?.body?.data || request?.query || {}
  const year = params.year || dayjs().year()
  const month = params.month ? params.month - 1 : dayjs().month()
  const paymentType = params.paymentType === 'private' ? 'private' : 'public'

  const dateFrom = dayjs().year(year).month(month).startOf('month')
  const dateTo = dateFrom.endOf('month')
  const dailyPaymentAmounts = await fetchDailyPaymentAmounts(dateFrom, dateTo, paymentType)

  cors(request, response, () => {
    response.json({
      data: dailyPaymentAmounts
    })
  })
})
