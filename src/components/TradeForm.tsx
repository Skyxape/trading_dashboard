import { useState } from 'react'
import type { TradeFormInput } from '../types/trade'
import { format } from 'date-fns'

interface TradeFormProps {
  onSubmit: (input: TradeFormInput) => void
}

const today = format(new Date(), 'yyyy-MM-dd')
const now = format(new Date(), 'HH:mm')

export default function TradeForm({ onSubmit }: TradeFormProps) {
  const [date, setDate] = useState(today)
  const [time, setTime] = useState(now)
  const [pnlStr, setPnlStr] = useState('')
  const [currency, setCurrency] = useState('EUR')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = pnlStr.replace(/−/g, '-').replace(',', '.')
    const pnl = parseFloat(normalized)
    if (isNaN(pnl)) return
    onSubmit({
      date,
      time,
      pnl,
      currency: currency.trim() || 'EUR',
    })
    setPnlStr('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-x-6 gap-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="min-w-[140px] rounded-none bg-transparent border-0 border-b border-[var(--border)] py-2 font-mono text-[15px] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:ring-0"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Heure</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="min-w-[100px] rounded-none bg-transparent border-0 border-b border-[var(--border)] py-2 font-mono text-[15px] text-[var(--text)] focus:border-[var(--border-focus)] focus:ring-0"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Gain / perte</label>
        <input
          type="text"
          inputMode="decimal"
          value={pnlStr}
          onChange={(e) => setPnlStr(e.target.value)}
          placeholder="−125.50 ou +320"
          className="min-w-[120px] rounded-none bg-transparent border-0 border-b border-[var(--border)] py-2 font-mono text-[15px] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:ring-0"
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Devise</label>
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="EUR"
          className="min-w-[72px] rounded-none bg-transparent border-0 border-b border-[var(--border)] py-2 font-mono text-[15px] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:ring-0 uppercase"
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] opacity-0 pointer-events-none">Ajouter</label>
        <button
          type="submit"
          className="min-w-[100px] rounded-none border border-[var(--border)] bg-transparent py-2 font-mono text-[13px] text-[var(--text)] hover:border-[var(--border-focus)] focus:border-[var(--border-focus)] focus:ring-0"
        >
          Ajouter
        </button>
      </div>
    </form>
  )
}
