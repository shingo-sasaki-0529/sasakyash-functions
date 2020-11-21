import * as functions from 'firebase-functions'
import { fetchCurrentBalance } from './zaim'
import * as dayjs from 'dayjs'

export const helloWorld = functions.https.onRequest(async (request, response) => {
  const year = request.query.year ? Number(request.query.year) : dayjs().year()
  const month = request.query.month ? Number(request.query.month) - 1 : dayjs().month()
  const payments = await fetchCurrentBalance(year, month, '私費')
  response.json({ data: payments })
})
