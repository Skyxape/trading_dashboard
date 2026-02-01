import type { Trade } from '../types/trade'
import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { format, startOfDay, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface DashboardProps {
  trades: Trade[]
}

export default function Dashboard({ trades }: DashboardProps) {
  const stats = useMemo(() => {
    const totalPnl = trades.reduce((s, t) => s + t.pnl, 0)
    const wins = trades.filter((t) => t.pnl > 0).length
    const losses = trades.filter((t) => t.pnl < 0).length
    const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0
    const avgWin = wins > 0 ? trades.filter((t) => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / wins : 0
    const avgLoss = losses > 0 ? trades.filter((t) => t.pnl < 0).reduce((s, t) => s + t.pnl, 0) / losses : 0
    const profitFactor = avgLoss !== 0 ? Math.abs(avgWin * wins / (avgLoss * losses)) : (wins > 0 ? 999 : 0)
    return { totalPnl, wins, losses, winRate, profitFactor }
  }, [trades])

  const cumulativeData = useMemo(() => {
    const byDate = new Map<string, number>()
    const sorted = [...trades].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    let cum = 0
    for (const t of sorted) {
      const key = format(startOfDay(parseISO(t.dateTime)), 'yyyy-MM-dd')
      cum += t.pnl
      byDate.set(key, cum)
    }
    return Array.from(byDate.entries()).map(([date, pnl]) => ({ date, pnl })).sort((a, b) => a.date.localeCompare(b.date))
  }, [trades])

  const byCurrency = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of trades) {
      map.set(t.currency, (map.get(t.currency) ?? 0) + t.pnl)
    }
    return Array.from(map.entries()).map(([currency, pnl]) => ({ currency, pnl })).sort((a, b) => b.pnl - a.pnl).slice(0, 10)
  }, [trades])

  const monthlyData = useMemo(() => {
    const map = new Map<string, { monthKey: string; pnl: number; label: string }>()
    for (const t of trades) {
      const d = parseISO(t.dateTime)
      const monthKey = format(d, 'yyyy-MM')
      const label = format(d, 'MMM yyyy', { locale: fr })
      const cur = map.get(monthKey)
      if (cur) {
        cur.pnl += t.pnl
      } else {
        map.set(monthKey, { monthKey, pnl: t.pnl, label })
      }
    }
    return Array.from(map.values())
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .slice(-12)
      .map(({ label, pnl }) => ({ month: label, pnl }))
  }, [trades])

  if (trades.length === 0) return null

  const tooltipStyle = {
    background: 'var(--bg-soft)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
    padding: '6px 10px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
  }

  const axisStyle = { fill: 'var(--text-muted)', fontSize: 10 }
  const gridStroke = 'var(--border)'

  return (
    <section className="space-y-10 pt-10 mt-10 border-t border-[var(--border)]">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">PnL total</p>
          <p className={`font-mono text-[17px] tabular-nums mt-0.5 ${stats.totalPnl >= 0 ? 'text-[var(--accent)]' : 'text-[var(--loss)]'}`}>
            {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnl.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Win rate</p>
          <p className="font-mono text-[17px] tabular-nums mt-0.5 text-[var(--text)]">{stats.winRate.toFixed(0)} %</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Gains</p>
          <p className="font-mono text-[17px] tabular-nums mt-0.5 text-[var(--accent)]">{stats.wins}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Profit factor</p>
          <p className="font-mono text-[17px] tabular-nums mt-0.5 text-[var(--text)]">{stats.profitFactor.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] mb-4">PnL cumulé</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <defs>
                <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="date" tick={axisStyle} tickFormatter={(v) => format(parseISO(v), 'd/MM', { locale: fr })} axisLine={{ stroke: gridStroke }} tickLine={false} />
              <YAxis tick={axisStyle} tickFormatter={(v) => v.toFixed(0)} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => format(parseISO(v), 'd MMM yyyy', { locale: fr })} formatter={(v: number | undefined) => [v != null ? v.toFixed(2) : '—', 'PnL']} />
              <Area type="monotone" dataKey="pnl" stroke="var(--accent)" strokeWidth={1} fill="url(#pnlGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] mb-4">Par devise</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCurrency} layout="vertical" margin={{ top: 8, right: 8, left: 40, bottom: 8 }}>
                <CartesianGrid strokeDasharray="2 2" stroke={gridStroke} horizontal={false} />
                <XAxis type="number" tick={axisStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
                <YAxis type="category" dataKey="currency" tick={axisStyle} width={36} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number | undefined) => [v != null ? v.toFixed(2) : '—', 'PnL']} />
                <Bar dataKey="pnl" fill="var(--accent)" radius={0} barSize={12} name="PnL" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] mb-4">Par mois</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="2 2" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" tick={axisStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
                <YAxis tick={axisStyle} tickFormatter={(v) => v.toFixed(0)} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number | undefined) => [v != null ? v.toFixed(2) : '—', 'PnL']} />
                <Bar dataKey="pnl" fill="var(--accent)" radius={0} barSize={12} name="PnL" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
