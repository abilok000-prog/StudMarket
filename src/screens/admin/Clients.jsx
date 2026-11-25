import { useState, useEffect } from 'react'
import { Avatar } from '../../components/Avatar.jsx'
import { OrderLine } from '../../components/OrderLine.jsx'
import { useApp } from '../../context/AppContext.js'
import { O, errText } from '../../i18n/ops.js'
import { db } from '../../lib/api.js'
import { fmt } from '../../lib/format.js'

export function Clients() {
  const { lang, clients, allOrders, loadClients, uid, staffIds, loadStaffIds, notify } = useApp()
  const op = O[lang]
  const [open, setOpen] = useState(null)
  useEffect(() => { loadClients() }, [])
  const list = clients.filter((c) => c.user_id !== uid)
  if (!list.length) return <p className="empty">—</p>
  return (
    <div className="orders-group">{list.map((c) => {
      const os = allOrders.filter((o) => o.user_id === c.user_id)
      const sum = os.filter((o) => o.pay_status === 'paid').reduce((a, o) => a + o.total, 0)
      return (
        <div key={c.user_id} className="client">
          <button className="client-row" onClick={() => setOpen(open === c.user_id ? null : c.user_id)}>
            <Avatar profile={c} size={46} />
            <span className="th-mid">
              <b>{c.full_name || '—'}{staffIds.includes(c.user_id) && <span className="pill role-admin" style={{ marginLeft: 6 }}>🛡 {op.admin}</span>}</b>
              <span className="muted" style={{ fontSize: 13 }}>{[c.university, c.faculty, c.course && `${c.course} курс`].filter(Boolean).join(' · ')}</span>
              <span className="mono" style={{ fontSize: 12 }}>{os.length} {op.ordersN} · {fmt(sum)} ₸</span>
            </span>
            <span className="muted">{open === c.user_id ? '▴' : '▾'}</span>
          </button>
          {open === c.user_id && <div className="client-body">
            <div className="row" style={{ gap: 8 }}>
              {c.phone && <a className="btn sm" href={`tel:${c.phone}`}>📞 {c.phone}</a>}
              {c.student_id && <span className="pill confirmed">ID {c.student_id}</span>}
              <button className={`btn sm ${staffIds.includes(c.user_id) ? '' : 'solid'}`} onClick={async () => {
                const make = !staffIds.includes(c.user_id)
                try { await db.setStaff(c.user_id, make); notify(make ? `🛡 ${op.makeAdmin}` : op.removeAdmin); loadStaffIds() } catch (e) { notify(errText(op, e)) }
              }}>{staffIds.includes(c.user_id) ? op.removeAdmin : `🛡 ${op.makeAdmin}`}</button>
            </div>
            {os.map((o) => <OrderLine key={o.id} o={o} staffView />)}
          </div>}
        </div>
      )
    })}</div>
  )
}
