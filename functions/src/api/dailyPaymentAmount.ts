import * as functions from 'firebase-functions'
import * as dayjs from 'dayjs'
import { fetchDailyPaymentAmounts } from '../zaim'
const cors = require('cors')({ origin: true })

export default functions.https.onRequest(async (request, response) => {
  const params = request.body.data
  const dateFrom = params.dateFrom ? dayjs(params.dateFrom as string) : dayjs().startOf('month')
  const dateTo = params.dateTo ? dayjs(params.dateTo as string) : dateFrom.endOf('month')
  const dailyPaymentAmounts = await fetchDailyPaymentAmounts(dateFrom, dateTo)

  cors(request, response, () => {
    response.json({
      data: dailyPaymentAmounts
    })
  })
})
