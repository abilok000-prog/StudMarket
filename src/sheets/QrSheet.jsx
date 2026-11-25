import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { O } from '../i18n/ops.js'
import { db } from '../lib/api.js'
import { fmt } from '../lib/format.js'

/* ───── QR sheet (student) — live status, pay, chat ───── */
export function QrSheet({ lang, t, order, onClose, onPay, onChat, onUpdate }) {
  const o = O[lang]
  const [live, setLive] = useState(order)
  useEffect(() => setLive(order), [order])
  useEffect(() => {
    if (!order?.qr_secret || ['done', 'cancelled'].includes(order.status)) return
    const id = setInterval(async () => {
      try { const r = await db.getOrder(order.id); if (r && (r.status !== live.status || r.pay_status !== live.pay_status)) { setLive(r); onUpdate(r) } } catch {}
    }, 3000)
    return () => clearInterval(id)
  }, [order?.id, order?.qr_secret, live.status, live.pay_status])
  const done = live.status === 'done'
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="kicker">{t.services[live.service].name}</span>
          <span className={`pill ${live.pay_status === 'paid' ? 'done' : 'pending'}`}>{live.pay_status === 'paid' ? o.paid : o.unpaid}</span>
        </div>
        <div className="h3">{live.title}</div>
        {done ? (
          <div className="confirmed">
            <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M14 27l8 8 16-17" /></svg>
            <div className="h3">{o.confirmed}</div>
            <div className="muted">{o.redeemedNote}</div>
          </div>
        ) : (
          <div className={`qr ${live.qr_secret ? '' : 'loading'}`}>
            <QRCodeSVG value={`STUDMARKET:${live.id}:${live.qr_secret || ''}`} size={196} fgColor="#15171f" />
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 20, letterSpacing: '.1em' }}>{live.id}</div>
          {!done && <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{t.qrHint} · {fmt(live.total)} ₸</div>}
        </div>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          {!done && live.pay_status !== 'paid' && live.total > 0 && <button className="btn solid" style={{ flex: 1 }} onClick={() => onPay(live)}>{o.pay}</button>}
          <button className="btn" style={{ flex: 1 }} onClick={() => onChat(live)}>💬 {o.chat}</button>
        </div>
        <button className="btn block ghost" onClick={onClose}>OK</button>
      </div>
    </div>
  )
}
