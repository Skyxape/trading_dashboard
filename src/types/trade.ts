export interface Trade {
  id: string
  dateTime: string // ISO
  pnl: number
  currency: string
}

export interface TradeFormInput {
  date: string // YYYY-MM-DD
  time: string // HH:mm
  pnl: number
  currency: string
}
