import { useState } from 'react'
import { Scanner } from '../components/Scanner.jsx'
import { O, errText } from '../i18n/ops.js'
import { db } from '../lib/api.js'
import { fmt } from '../lib/format.js'

/* ───── Center QR sheet: staff scan / my codes ───── */
export function ScanSheet({ lang, t, staff, orders, onClose, onRedeemed, onShowQr }) {
  const o = O[lang]
  const [tab, setTab] = useState(staff ? 'scan' : 'mine')
  const [res, setRes] = useState(null)
  const redeem = async (id, secret) => {
    try { const r = await db.redeem(id, secret); navigator.vibrate?.(80); setRes({ ok: true, o: r }); onRedeemed(r) }
    catch (e) { navigator.vibrate?.([60, 60, 60]); setRes({ ok: false, msg: errText(o, e), id }) }
  }
  const active = orders.filter((x) => !['done', 'cancelled'].includes(x.status))
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal scan-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}><div className="h3">{o.qrCenter}</div><button className="btn sm" onClick={onClose}>✕</button></div>
        <div className="seg">
          <button className={tab === 'scan' ? 'on' : ''} onClick={() => { setTab('scan'); setRes(null) }}>📷 {o.scan}</button>
          <button className={tab === 'mine' ? 'on' : ''} onClick={() => setTab('mine')}>{o.myQr} · {active.length}</button>
        </div>
        {tab === 'scan' && !staff && <div className="panel muted" style={{ textAlign: 'center' }}>🛡 {o.staffOnlyScan}</div>}
        {tab === 'scan' && staff && !res && <Scanner lang={lang} onResult={redeem} bare />}
        {tab === 'scan' && res && (
          <div className="panel" style={{ textAlign: 'center' }}>
            {res.ok ? <div className="confirmed"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M14 27l8 8 16-17" /></svg><div className="h3">{o.ok}</div>
              <div className="mono">{res.o.id}</div><div>{res.o.title}</div><div className="muted">{res.o.customer_name} · {fmt(res.o.total)} ₸ · ✓ {o.paid}</div></div>
              : <div className="scan-fail"><div style={{ fontSize: 44 }}>⚠️</div><div className="h3">{res.msg}</div><div className="mono muted">{res.id}</div></div>}
            <button className="btn solid block" style={{ marginTop: 14 }} onClick={() => setRes(null)}>📷 {o.again}</button>
          </div>
        )}
        {tab === 'mine' && (active.length ? <div className="items">{active.map((x) => (
          <button key={x.id} className="item" onClick={() => onShowQr(x)}>
            <span style={{ textAlign: 'left' }}><span className="nm" style={{ display: 'block' }}>{x.title}</span><span className="mono muted" style={{ fontSize: 12 }}>{x.id} · {t.status[x.status]}</span></span>
            <span className="btn sm">QR →</span>
          </button>))}</div> : <div className="muted" style={{ textAlign: 'center', padding: 20 }}>{o.noActive}</div>)}
      </div>
    </div>
  )
}
