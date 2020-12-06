import * as dayjs from 'dayjs'
type Dayjs = dayjs.Dayjs

/**
 * 指定した期間の日付一覧を取得する
 * ex) ['2020-10-01', '2020-10-02', ... '2020-10-31']
 */
export const dateRange = (_startDate: Dayjs, _endDate: Dayjs) => {
  const startDate = _startDate.startOf('day')
  const endDate = _endDate.startOf('day')

  const dateList: Dayjs[] = []
  let iteratorDate: Dayjs = startDate

  while (iteratorDate.unix() <= endDate.unix()) {
    dateList.push(dayjs(iteratorDate))
    iteratorDate = iteratorDate.add(1, 'day')
  }

  return dateList
}
