import { useState, useEffect } from 'react'
import { Avatar } from '../../components/Avatar.jsx'
import { OrderLine } from '../../components/OrderLine.jsx'
import { Scanner } from '../../components/Scanner.jsx'
import { useApp } from '../../context/AppContext.js'
import { STATUS_FLOW } from '../../data/catalog.js'
import { O, errText } from '../../i18n/ops.js'
import { db } from '../../lib/api.js'
import { ddmm, fmt } from '../../lib/format.js'
import { Clients } from './Clients.jsx'

export function Admin() {
  const { t, lang, allOrders, setStatus, go, notify, loadAll, upsertOrder, staff, clients, uid, reqs, loadReqs, loadStaffIds } = useApp()
  const op = O[lang]
  const [tab, setTab] = useState('scan')
  const [last, setLast] = useState(null)
  useEffect(() => { loadAll(); loadReqs(); const id = setInterval(() => { loadAll(); loadReqs() }, 8000); return () => clearInterval(id) }, [])
  if (!staff) return <p className="empty">{op.errs.forbidden}</p>
  const redeem = async (id, secret) => {
    try { const r = await db.redeem(id, secret); upsertOrder(r); setLast({ ok: true, o: r }); notify(op.ok) }
    catch (e) { setLast({ ok: false, msg: errText(op, e), id }) }
  }
  const advance = (o) => setStatus(o.id, STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(o.status) + 1, STATUS_FLOW.length - 1)])
  const counts = STATUS_FLOW.map((s) => allOrders.filter((o) => o.status === s).length)
  const revenue = allOrders.filter((o) => o.pay_status === 'paid').reduce((a, o) => a + o.total, 0)
  return (
    <>
      <div className="svc-head"><span className="kicker">🛡 {op.staff}</span><h1 className="h1">{t.admin.title}</h1></div>
      <div className="admin-stats">
        {STATUS_FLOW.slice(0, 3).map((s, i) => <div className="stat" key={s} style={{ flexDirection: 'column', alignItems: 'flex-start' }}><b>{counts[i]}</b><span>{t.status[s]}</span></div>)}
        <div className="stat" style={{ flexDirection: 'column', alignItems: 'flex-start' }}><b>{fmt(revenue)}</b><span>₸ · {op.paid}</span></div>
      </div>
      <div className="seg" style={{ marginBottom: 16 }}>
        <button className={tab === 'scan' ? 'on' : ''} onClick={() => setTab('scan')}>📷 {op.scan}</button>
        <button className={tab === 'list' ? 'on' : ''} onClick={() => setTab('list')}>{op.allOrders} · {allOrders.length}</button>
        <button className={tab === 'clients' ? 'on' : ''} onClick={() => setTab('clients')}>{op.clients} · {clients.filter((c) => c.user_id !== uid).length}</button>
        <button className={tab === 'reqs' ? 'on' : ''} onClick={() => setTab('reqs')}>{op.requests}{reqs.length ? <span className="badge">{reqs.length}</span> : ' · 0'}</button>
      </div>
      {tab === 'reqs' && (reqs.length ? <div className="orders-group">{reqs.map((r) => {
        const c = clients.find((x) => x.user_id === r.user_id)
        const review = async (ok) => { try { await db.reviewAdminRequest(r.id, ok); notify(ok ? `✓ ${op.approve}` : `✕ ${op.reject}`); loadReqs(); loadStaffIds() } catch (e) { notify(errText(op, e)) } }
        return (
          <div key={r.id} className="req-card">
            <div className="row" style={{ gap: 12, flexWrap: 'nowrap' }}>
              {c ? <Avatar profile={c} size={46} /> : <span className="app-icon">🛡</span>}
              <div className="th-mid"><b>{r.full_name || c?.full_name || '—'}</b><span className="muted" style={{ fontSize: 13 }}>{[c?.university, c?.faculty].filter(Boolean).join(' · ')}</span></div>
              <span className="muted" style={{ fontSize: 12 }}>{ddmm(r.created_at)}</span>
            </div>
            {r.reason && <div className="req-reason">“{r.reason}”</div>}
            <div className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
              <button className="btn" style={{ flex: 1 }} onClick={() => review(false)}>✕ {op.reject}</button>
              <button className="btn solid" style={{ flex: 1 }} onClick={() => review(true)}>✓ {op.approve}</button>
            </div>
          </div>
        )
      })}</div> : <p className="empty">{op.noReqs}</p>)}
      {tab === 'clients' && <Clients />}
      {tab === 'scan' && <div className="svc-body">
        <Scanner lang={lang} onResult={redeem} />
        <div className="panel">
          {!last && <div className="muted">{op.scanHint}</div>}
          {last?.ok && <div className="confirmed"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M14 27l8 8 16-17" /></svg><div className="h3">{op.ok}</div>
            <div className="mono">{last.o.id}</div><div>{last.o.title}</div><div className="muted">{last.o.customer_name} · {fmt(last.o.total)} ₸</div></div>}
          {last && !last.ok && <div className="scan-fail"><div style={{ fontSize: 44 }}>⚠️</div><div className="h3">{last.msg}</div><div className="mono muted">{last.id}</div></div>}
        </div>
      </div>}
      {tab === 'list' && (allOrders.length ? <div className="orders-group">{allOrders.map((o) => (
        <OrderLine key={o.id} o={o} staffView extra={!['done', 'cancelled'].includes(o.status) && (
          <div className="row" style={{ gap: 6 }}>
            <button className="btn sm" onClick={() => setStatus(o.id, 'cancelled')}>✕</button>
            <button className="btn sm solid" onClick={() => advance(o)}>{t.status[STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1]]} →</button>
          </div>
        )} />
      ))}</div> : <p className="empty">{t.admin.empty}</p>)}
    </>
  )
}
