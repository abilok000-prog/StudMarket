import { useState } from 'react'
import { O } from '../i18n/ops.js'
import { db } from '../lib/api.js'
import { fmt } from '../lib/format.js'

/* ───── Payment sheet (simple, demo) ───── */
export function PaySheet({ lang, order, onClose, onPaid }) {
  const o = O[lang]
  const [m, setM] = useState('kaspi')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const coins = Math.floor(order.total * 0.05)
  const go = async () => {
    setBusy(true); setErr('')
    try {
      if (m !== 'cash') await new Promise((r) => setTimeout(r, 1200)) // simulated gateway
      onPaid(await db.pay(order.id, m, m !== 'cash'), m !== 'cash' ? coins : 0)
    } catch (e) { setErr(String(e.message || e)) } finally { setBusy(false) }
  }
  const methods = [['kaspi', o.kaspi, '#f14635', 'K'], ['card', o.card, '#1f2937', '▭'], ['cash', o.cash, '#22a06b', '₸']]
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="h3">{o.payTitle}</div>
        <div className="pay-total"><span className="muted">{order.title}</span><b>{fmt(order.total)} ₸</b></div>
        <div className="items">
          {methods.map(([k, n, c, ic]) => (
            <button key={k} className={`item pay-m ${m === k ? 'sel' : ''}`} onClick={() => setM(k)}>
              <span className="row" style={{ gap: 12, flexWrap: 'nowrap' }}><span className="pay-ic" style={{ background: c }}>{ic}</span><span className="nm" style={{ fontSize: 15 }}>{n}</span></span>
              <span className={`radio ${m === k ? 'on' : ''}`} />
            </button>
          ))}
        </div>
        {m !== 'cash' ? <div className="coin-note">🪙 +{coins} StudCoins · {o.coinsSub}</div> : <div className="muted" style={{ fontSize: 13 }}>{o.cashNote}</div>}
        {err && <div className="err">{err}</div>}
        <button className="btn solid block" disabled={busy} onClick={go}>{busy ? <span className="spinner" /> : m === 'cash' ? 'OK' : `${o.payNow} ${fmt(order.total)} ₸`}</button>
        <div className="muted" style={{ fontSize: 11, textAlign: 'center' }}>{o.demo}</div>
      </div>
    </div>
  )
}
