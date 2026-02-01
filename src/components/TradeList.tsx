import type { Trade } from '../types/trade'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface TradeListProps {
  trades: Trade[]
  onDelete: (id: string) => void
}

export default function TradeList({ trades, onDelete }: TradeListProps) {
  const sorted = [...trades].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()).slice(0, 30)

  if (sorted.length === 0) return null

  return (
    <ul className="border-t border-[var(--border)] pt-6 max-h-[320px] overflow-y-auto">
      {sorted.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between gap-4 py-3 border-b border-[var(--border)] last:border-0"
        >
          <span className="font-mono text-[13px] text-[var(--text-muted)] tabular-nums">
            {format(parseISO(t.dateTime), 'd MMM yyyy · HH:mm', { locale: fr })}
          </span>
          <span className="font-mono text-[13px] text-[var(--text-muted)] uppercase">{t.currency}</span>
          <span className={`font-mono text-[15px] tabular-nums ${t.pnl >= 0 ? 'text-[var(--accent)]' : 'text-[var(--loss)]'}`}>
            {t.pnl >= 0 ? '+' : ''}{t.pnl.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => onDelete(t.id)}
            className="text-[var(--text-muted)] hover:text-[var(--text)] font-mono text-[18px] leading-none w-6 h-6 flex items-center justify-center focus:outline-none focus:text-[var(--text)]"
            title="Supprimer"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
