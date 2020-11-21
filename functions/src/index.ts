import * as functions from 'firebase-functions'
import { fetchPayments } from './zaim'

export const helloWorld = functions.https.onRequest(async (_, response) => {
  const payments = await fetchPayments(new Date('2020/11/01'), new Date('2020/11/30'), '公費')
  response.json({ data: payments })
})
