import { useState, useEffect, useCallback, useRef } from 'react'
import type { Trade, TradeFormInput } from '../types/trade'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'trading-dashboard-trades'

function loadTrades(): Trade[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown[]
    if (!Array.isArray(parsed)) return []
    return parsed.map((row: unknown) => {
      const r = row as Record<string, unknown>
      if (r.dateTime && typeof r.pnl === 'number' && r.currency) {
        return { id: r.id, dateTime: r.dateTime, pnl: r.pnl, currency: String(r.currency) } as Trade
      }
      // Ancien format : date, symbol, pnl, etc.
      const date = r.date as string
      const dateTime = date && !date.includes('T') ? `${date}T00:00:00.000Z` : (date || '')
      const pnl = typeof r.pnl === 'number' ? r.pnl : 0
      const currency = (r.symbol as string) || (r.currency as string) || 'EUR'
      return { id: r.id as string, dateTime, pnl, currency } as Trade
    }).filter((t): t is Trade => Boolean(t.id && t.dateTime))
  } catch {
    return []
  }
}

function saveTrades(trades: Trade[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
}

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    setTrades(loadTrades())
  }, [])

  const isFirstRun = useRef(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    saveTrades(trades)
  }, [trades])

  const addTrade = useCallback((input: TradeFormInput) => {
    const dateTime = `${input.date}T${input.time}:00.000Z`
    const trade: Trade = {
      id: uuidv4(),
      dateTime,
      pnl: input.pnl,
      currency: input.currency.trim().toUpperCase() || 'EUR',
    }
    setTrades((prev) => [...prev, trade])
  }, [])

  const deleteTrade = useCallback((id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { trades, addTrade, deleteTrade }
}
