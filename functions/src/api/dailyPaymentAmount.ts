import * as functions from 'firebase-functions'
import * as dayjs from 'dayjs'
import { fetchDailyPaymentAmount } from '../zaim'
const cors = require('cors')({ origin: true })

export default functions.https.onRequest(async (request, response) => {
  const dateFrom = request.query.dateFrom ? dayjs(request.query.dateFrom as string) : dayjs().startOf('month')
  const dateTo = request.query.dateTo ? dayjs(request.query.dateTo as string) : dateFrom.endOf('month')
  const payments = await fetchDailyPaymentAmount(dateFrom, dateTo)

  cors(request, response, () => {
    response.json({
      data: {
        payments
      }
    })
  })
})
