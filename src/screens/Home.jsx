import { CoinsCard } from '../components/CoinsCard.jsx'
import { OrderLine } from '../components/OrderLine.jsx'
import { useApp } from '../context/AppContext.js'
import { lockers, promos } from '../data/catalog.js'
import { ServiceList } from './Services.jsx'

/* ───────── Home ───────── */
export function Home() {
  const { t, go, orders, lang, setQr } = useApp()
  const last = orders[0]
  const free = lockers.filter((l) => !l.busy).length
  return (
    <>
      <section className="hero">
        <div className="stack">
          <span className="kicker">{t.heroKicker}</span>
          <h1 className="h1">{t.heroTitle.split('—')[0]}—<em>{t.heroTitle.split('—')[1]}</em></h1>
          <p className="lead">{t.heroLead}</p>
          <div className="row">
            <button className="btn solid" onClick={() => go('services')}>{t.heroCta} →</button>
            <button className="btn" onClick={() => go('orders')}>{t.heroCta2}</button>
          </div>
        </div>
        <div className="hero-art">
          <div className="stat"><b>2 418</b><span>{t.stats[0]}</span></div>
          <div className="stat"><b>{free}</b><span>{t.stats[1]}</span></div>
          <div className="stat"><b>{136 + orders.length}</b><span>{t.stats[2]}</span></div>
        </div>
      </section>

      <section className="section"><CoinsCard lang={lang} orders={orders} /></section>
      <section className="section">
        <div className="section-head"><h2 className="h3">{t.index}</h2><span className="kicker">05</span></div>
        <ServiceList />
      </section>

      <div className="cols">
        <section className="section">
          <div className="section-head"><h2 className="h3">{t.lastOrder}</h2></div>
          {last ? <div className="orders-group"><OrderLine o={last} onQr={() => setQr(last)} /></div> : <p className="empty">{t.noOrders}</p>}
        </section>
        <section className="section">
          <div className="section-head"><h2 className="h3">{t.promoTitle}</h2></div>
          <div className="promos">{promos.map((p) => (
            <div className="promo" key={p.code}>
              <div><div className="kicker">{t.services[p.service].name}</div><div style={{ fontWeight: 600, marginTop: 4 }}>{p.text[lang]}</div></div>
              <span className="coupon">{p.code}</span>
            </div>
          ))}</div>
        </section>
      </div>
    </>
  )
}
