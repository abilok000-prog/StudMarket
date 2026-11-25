import { O } from '../i18n/ops.js'
import { fmt } from '../lib/format.js'

/* ───── StudCoins card (taste idea) ───── */
export const LEVELS = [['Bronze', 0, '#cd7f32'], ['Silver', 300, '#9ca3af'], ['Gold', 1000, '#f5b301'], ['Platinum', 3000, '#7c83ff']]

export function CoinsCard({ lang, orders }) {
  const o = O[lang]
  const coins = orders.filter((x) => x.pay_status === 'paid').reduce((s, x) => s + Math.floor(x.total * 0.05), 0)
  const li = LEVELS.reduce((a, l, i) => (coins >= l[1] ? i : a), 0)
  const next = LEVELS[li + 1]
  const pct = next ? ((coins - LEVELS[li][1]) / (next[1] - LEVELS[li][1])) * 100 : 100
  return (
    <div className="coins">
      <div className="coins-top">
        <div><div className="kicker" style={{ color: 'rgba(255,255,255,.7)' }}>{o.coins}</div><div className="coins-val">🪙 {fmt(coins)}</div></div>
        <span className="coins-lvl" style={{ background: LEVELS[li][2] }}>{LEVELS[li][0]}</span>
      </div>
      <div className="coins-bar"><i style={{ width: `${Math.max(4, pct)}%` }} /></div>
      <div className="coins-foot">{next ? `${fmt(next[1] - coins)} ${o.toNext} · ${next[0]}` : o.coinsSub}<span>{o.coinsSub}</span></div>
    </div>
  )
}
