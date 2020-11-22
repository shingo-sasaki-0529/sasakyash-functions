import * as functions from 'firebase-functions'
import { fetchCurrentBalance } from './zaim'
import * as dayjs from 'dayjs'

export const balance = functions.https.onRequest(async (request, response) => {
  const year = request.query.year ? Number(request.query.year) : dayjs().year()
  const month = request.query.month ? Number(request.query.month) - 1 : dayjs().month()

  const privateBalance = await fetchCurrentBalance(year, month, 'private')
  const publicBalance = await fetchCurrentBalance(year, month, 'public')
  response.json({
    data: {
      private: privateBalance,
      public: publicBalance
    }
  })
})
