export type MoneyType = 'income' | 'payment'
export type PaymentType = '公費' | '私費'
export interface Money {
  id: number
  user_id: number
  date: string
  mode: string
  category_id: number
  genre_id: number
  from_account_id: number
  to_account_id: number
  amount: number
  comment: string
  active: number
  created: string
  currency_code: string
  name: string
  receipt_id: number
  place_uid: string
  place: string
}
