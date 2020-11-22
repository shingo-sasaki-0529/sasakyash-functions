import * as dayjs from 'dayjs'
type Dayjs = dayjs.Dayjs

export const dateRange = (startDate: Dayjs, endDate: Dayjs) => {
  startDate = startDate.startOf('day')
  endDate = endDate.startOf('day')

  const dateList: Dayjs[] = []
  let iteratorDate: Dayjs = startDate
  while (iteratorDate.unix() <= endDate.unix()) {
    dateList.push(dayjs(iteratorDate))
    iteratorDate = iteratorDate.add(1, 'day')
  }

  return dateList
}
