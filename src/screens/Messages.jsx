import { Avatar } from '../components/Avatar.jsx'
import { SvcIcon } from '../components/SvcIcon.jsx'
import { useApp } from '../context/AppContext.js'
import { O } from '../i18n/ops.js'
import { ddmm } from '../lib/format.js'

/* ───────── Messages ───────── */
export function Messages() {
  const { t, lang, threads, setChatFor, staff, orders, allOrders, clients, uid, go } = useApp()
  const op = O[lang]
  const byId = (id) => orders.find((x) => x.id === id) || allOrders.find((x) => x.id === id)
  const cl = (u) => clients.find((c) => c.user_id === u)
  const time = (iso) => { const d = new Date(iso); return d.toDateString() === new Date().toDateString() ? d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ddmm(iso) }
  return (
    <>
      <div className="svc-head"><span className="kicker">{threads.length} · {op.chat}</span><h1 className="h1">{t.nav.messages}</h1></div>
      {threads.length ? <div className="threads">{threads.map((th) => {
        const o = byId(th.order_id)
        const isClient = staff && o && o.user_id !== uid
        const c = isClient ? cl(o.user_id) : null
        return (
          <button key={th.order_id} className="thread" onClick={() => setChatFor(th.order_id)}>
            {c ? <Avatar profile={c} size={46} /> : o ? <SvcIcon id={o.service} /> : <span className="app-icon">💬</span>}
            <span className="th-mid">
              <span className="th-top"><b>{isClient ? (o.customer_name || c?.full_name) : o ? t.services[o.service].name : th.order_id}</b><span className="muted">{time(th.last.created_at)}</span></span>
              <span className="th-sub mono">{th.order_id}{o ? ` · ${o.title}` : ''}</span>
              <span className={`th-last ${th.unread ? 'strong' : ''}`}>{th.last.sender_id === uid ? `${op.you}: ` : th.last.is_staff ? '🛡 ' : ''}{th.last.body}</span>
            </span>
            {th.unread > 0 && <span className="badge">{th.unread}</span>}
          </button>
        )
      })}</div> : <div><p className="empty">{op.noThreads}</p><button className="btn solid" onClick={() => go('orders')}>{t.nav.orders} →</button></div>}
    </>
  )
}
