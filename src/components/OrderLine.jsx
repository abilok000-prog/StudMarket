import { SvcIcon } from './SvcIcon.jsx'
import { useApp } from '../context/AppContext.js'
import { O } from '../i18n/ops.js'
import { fmt } from '../lib/format.js'
import { Orders } from '../screens/Orders.jsx'

/* ───────── Orders / QR ───────── */
export function OrderLine({ o, onQr, extra, staffView }) {
  const { t, lang, setChatFor } = useApp()
  const op = O[lang]
  return (
    <div className="order-line">
      <SvcIcon id={o.service} />
      <div>
        <div className="kicker" style={{ marginBottom: 4 }}>{t.services[o.service].name}</div>
        <div className="title">{o.title}</div>
        <div className="meta">{o.id} · {o.date} · {fmt(o.total)} {t.tg}{staffView && o.customer_name ? ` · ${o.customer_name}` : ''}</div>
        <div className="row" style={{ gap: 6, marginTop: 6 }}>
          <span className={`pill ${o.pay_status === 'paid' ? 'done' : 'cancelled'}`}>{o.pay_status === 'paid' ? `✓ ${op.paid}` : o.pay_method === 'cash' ? op.cash : op.unpaid}</span>
          <button className="pill confirmed" onClick={() => setChatFor(o)}>💬 {op.chat}</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
        <span className={`pill ${o.status}`}>{t.status[o.status]}</span>
        {onQr && <button className="btn sm" onClick={onQr}>{t.showQr}</button>}
        {extra}
      </div>
    </div>
  )
}
