import { OrderLine } from '../components/OrderLine.jsx'
import { useApp } from '../context/AppContext.js'

export function Orders() {
  const { t, orders, setQr, go } = useApp()
  return (
    <>
      <div className="svc-head"><span className="kicker">{orders.length} · {t.nav.orders}</span><h1 className="h1">{t.nav.orders}</h1></div>
      {orders.length ? <div className="orders-group">{orders.map((o) => <OrderLine key={o.id} o={o} onQr={() => setQr(o)} />)}</div>
        : <div><p className="empty">{t.noOrders}</p><button className="btn solid" onClick={() => go('services')}>{t.heroCta} →</button></div>}
    </>
  )
}
