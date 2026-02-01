import { useTrades } from './store/useTrades'
import Dashboard from './components/Dashboard'
import TradeForm from './components/TradeForm'
import TradeList from './components/TradeList'

export default function App() {
  const { trades, addTrade, deleteTrade } = useTrades()

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <h1 className="text-[11px] font-normal uppercase tracking-[0.2em] text-[var(--text-muted)]">Trade</h1>
        <p className="mt-1 text-[13px] text-[var(--text-muted)]">{trades.length} opération{trades.length !== 1 ? 's' : ''}</p>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-16">
        <section className="space-y-8">
          <TradeForm onSubmit={addTrade} />
          <TradeList trades={trades} onDelete={deleteTrade} />
        </section>
        <Dashboard trades={trades} />
      </main>
    </div>
  )
}
