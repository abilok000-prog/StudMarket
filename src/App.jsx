import { useState, useEffect, useMemo } from 'react'
import { AuthScreen } from './auth/AuthScreen.jsx'
import { Onboarding } from './auth/Onboarding.jsx'
import { ProfileEditor } from './auth/ProfileEditor.jsx'
import { Splash } from './auth/Splash.jsx'
import { Avatar } from './components/Avatar.jsx'
import { Brand } from './components/Brand.jsx'
import { Icon } from './components/Icon.jsx'
import { Langs } from './components/Langs.jsx'
import { ThemePicker } from './components/ThemePicker.jsx'
import { Ctx } from './context/AppContext.js'
import { A } from './i18n/auth.js'
import { T } from './i18n/index.js'
import { O } from './i18n/ops.js'
import { auth, clearToken, db, myUserId } from './lib/api.js'
import { ddmm, today } from './lib/format.js'
import { KEY, load } from './lib/storage.js'
import { Home } from './screens/Home.jsx'
import { Messages } from './screens/Messages.jsx'
import { Orders } from './screens/Orders.jsx'
import { Profile } from './screens/Profile.jsx'
import { Service, Services } from './screens/Services.jsx'
import { Admin } from './screens/admin/Admin.jsx'
import { AdminRequestSheet } from './sheets/AdminRequestSheet.jsx'
import { ChatSheet } from './sheets/ChatSheet.jsx'
import { PaySheet } from './sheets/PaySheet.jsx'
import { QrSheet } from './sheets/QrSheet.jsx'
import { ScanSheet } from './sheets/ScanSheet.jsx'

/* Root: splash -> auth -> onboarding -> app */
export default function App() {
  const saved = load()
  const [splash, setSplash] = useState(true)
  const [phase, setPhase] = useState('loading')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [lang, setLang] = useState(saved.lang || 'kz')
  const [pendingName, setPendingName] = useState('')

  useEffect(() => { document.documentElement.dataset.theme = profile?.theme || saved.theme || 'aurora' }, [profile?.theme])
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ ...load(), lang })) } catch {} }, [lang])
  useEffect(() => { document.documentElement.lang = lang === 'kz' ? 'kk' : lang }, [lang])

  const resolve = async (u) => {
    if (!u) { setPhase('auth'); return }
    setUser(u)
    try {
      const pr = await db.getProfile()
      if (pr?.onboarded) { setProfile(pr); if (pr.lang) setLang(pr.lang); setPhase('app') }
      else setPhase('onboarding')
    } catch { setPhase('onboarding') }
  }
  useEffect(() => {
    auth.getSession().then(({ data }) => resolve(data?.user || null)).catch(() => setPhase('auth'))
  }, [])

  const signOut = async () => { await auth.signOut(); clearToken(); setUser(null); setProfile(null); setPhase('auth') }

  let screen = <div className="loader"><span className="spinner" /></div>
  if (phase === 'auth') screen = <AuthScreen lang={lang} setLang={setLang} onAuthed={(u, name) => { setPendingName(name || u?.name || ''); resolve(u) }} />
  if (phase === 'onboarding') screen = <Onboarding lang={lang} initial={{ full_name: pendingName || user?.name || '' }} onDone={(pr) => { setProfile(pr); setPhase('app') }} />
  if (phase === 'app') screen = <MainApp profile={profile} setProfile={setProfile} lang={lang} setLang={setLang} onSignOut={signOut} />
  return <>{screen}{splash && <Splash done={() => setSplash(false)} />}</>
}

export function MainApp({ profile, setProfile, lang, setLang: setLangRaw, onSignOut }) {
  const saved = load()
  const [orders, setOrders] = useState([])
  const [lost, setLostRaw] = useState([])
  const [skills, setSkillsRaw] = useState([])
  const [staff, setStaff] = useState(false)
  const [uid, setUid] = useState(null)
  const [allOrders, setAllOrders] = useState([])
  const [payFor, setPayFor] = useState(null)
  const [chatFor, setChatFor] = useState(null)
  const admin = staff
  const theme = profile.theme || 'aurora'
  const [editing, setEditing] = useState(false)
  const [route, setRoute] = useState({ page: 'home' })
  const [toast, setToast] = useState(null)
  const [qrId, setQrId] = useState(null)
  const setQr = (o) => setQrId(o?.id || null)
  const [scanOpen, setScanOpen] = useState(false)
  const [myReq, setMyReq] = useState(null)
  const [reqOpen, setReqOpen] = useState(false)
  const [reqs, setReqs] = useState([])
  const [staffIds, setStaffIds] = useState([])
  const loadReqs = () => db.listAdminRequests().then(setReqs).catch(() => {})
  const loadStaffIds = () => db.listStaff().then(setStaffIds).catch(() => {})
  const [msgs, setMsgs] = useState([])
  const [clients, setClients] = useState([])
  const [seen, setSeenRaw] = useState(() => saved.seen || {})
  const markSeen = (id) => setSeenRaw((p) => { const n = { ...p, [id]: new Date().toISOString() }; try { localStorage.setItem(KEY, JSON.stringify({ ...load(), seen: n })) } catch {} return n })
  const loadMsgs = () => db.listRecentMessages().then(setMsgs).catch(() => {})
  const loadClients = () => db.listClients().then(setClients).catch(() => {})
  useEffect(() => { loadMsgs(); const id = setInterval(loadMsgs, 6000); return () => clearInterval(id) }, [])

  const mapO = (o) => ({ ...o, date: ddmm(o.created_at) })
  const loadAll = () => db.listAllOrders().then((r) => setAllOrders(r.map(mapO))).catch(() => {})
  useEffect(() => {
    myUserId().then((id) => { setUid(id); return db.listMyOrders(id) }).then((r) => setOrders(r.map(mapO))).catch(() => {})
    db.isStaff().then((v) => {
      setStaff(!!v)
      if (v) { loadAll(); loadClients(); loadReqs(); loadStaffIds() }
      db.myAdminRequest().then((r) => {
        setMyReq(r)
        if (v && r?.status === 'approved' && !load().adminWelcomed) { notify(O[lang].nowAdmin); try { localStorage.setItem(KEY, JSON.stringify({ ...load(), adminWelcomed: true })) } catch {} }
      }).catch(() => {})
    }).catch(() => {})
    db.listLost().then((r) => setLostRaw(r.map((p) => ({ ...p, date: ddmm(p.created_at) })))).catch(() => {})
    db.listSkills().then((r) => setSkillsRaw(r.map((x) => ({ ...x, name: x.author })))).catch(() => {})
  }, [])
  const patchProfile = (o) => { const np = { ...profile, ...o }; setProfile(np); db.saveProfile(np).catch(() => {}) }
  const setTheme = (th) => patchProfile({ theme: th })
  const setLang = (l) => { setLangRaw(l); patchProfile({ lang: l }) }
  const addLost = async (p) => { const r = await db.addLost(p); setLostRaw((x) => [{ ...r, date: ddmm(r.created_at) }, ...x]) }
  const addSkill = async (sk) => { const r = await db.addSkill({ ...sk, author: profile.full_name }); setSkillsRaw((x) => [{ ...r, name: r.author }, ...x]) }
  const upsertOrder = (r) => { const m = mapO(r); setOrders((p) => p.map((o) => (o.id === m.id ? m : o))); setAllOrders((p) => p.map((o) => (o.id === m.id ? m : o))) }
  const setStatus = (id, status) => db.staffSetStatus(id, status).then(upsertOrder).catch((e) => notify(e.message))
  const qrOrder = qrId && (orders.find((o) => o.id === qrId) || allOrders.find((o) => o.id === qrId))
  const me = { id: uid, name: profile.full_name }
  const threads = useMemo(() => {
    const m = new Map()
    for (const x of msgs) {
      const th = m.get(x.order_id) || { order_id: x.order_id, last: x, unread: 0, count: 0 }
      th.count++
      if (x.sender_id !== uid && (!seen[x.order_id] || x.created_at > seen[x.order_id])) th.unread++
      m.set(x.order_id, th)
    }
    return [...m.values()]
  }, [msgs, seen, uid])
  const unreadTotal = threads.reduce((a, th) => a + th.unread, 0)
  const openChat = async (orderOrId) => {
    let o = typeof orderOrId === 'string' ? (orders.find((x) => x.id === orderOrId) || allOrders.find((x) => x.id === orderOrId)) : orderOrId
    if (!o) { try { o = await db.getOrder(orderOrId) } catch {} }
    if (o) { markSeen(o.id); setChatFor(o) }
  }

  const t = T[lang]
  const go = (page, extra = {}) => { setRoute({ page, ...extra }); window.scrollTo(0, 0) }
  const notify = (msg) => { setToast(msg); clearTimeout(window.__tt); window.__tt = setTimeout(() => setToast(null), 2400) }
  const addOrder = (o) => {
    const order = { id: 'SM-' + Math.random().toString(36).slice(2, 7).toUpperCase(), status: 'pending', date: today(), ...o }
    setOrders((p) => [order, ...p])
    db.addOrder({ id: order.id, service: order.service, title: order.title, total: order.total, customer_name: profile.full_name })
      .then((r) => { upsertOrder(r); if (staff) setAllOrders((p) => [mapO(r), ...p]) })
      .catch((e) => notify(e.message))
    notify(t.added)
    return order
  }
  const active = orders.filter((o) => !['done', 'cancelled'].includes(o.status)).length

  const app = { lang, setLang, t, go, notify, orders, setOrders, addOrder, lost, addLost, skills, addSkill, setStatus, admin, staff, setQr, theme, setTheme, profile, setEditing, onSignOut, allOrders, loadAll, setChatFor: openChat, setPayFor, upsertOrder, uid, threads, clients, loadClients, setScanOpen, myReq, setReqOpen, reqs, loadReqs, staffIds, loadStaffIds }

  const tabs = [['home'], ['services'], ['qr'], ['messages', unreadTotal], admin ? ['admin', reqs.length] : ['orders', active]]
  const sideTabs = [['home'], ['services'], ['orders', active], ['messages', unreadTotal], ['profile'], ...(admin ? [['admin', reqs.length]] : [])]
  const navKey = route.page === 'service' ? 'services' : route.page

  let view
  if (route.page === 'home') view = <Home />
  else if (route.page === 'services') view = <Services />
  else if (route.page === 'service') view = <Service id={route.id} />
  else if (route.page === 'orders') view = <Orders />
  else if (route.page === 'profile') view = <Profile />
  else if (route.page === 'admin') view = <Admin />
  else if (route.page === 'messages') view = <Messages />

  return (
    <Ctx.Provider value={app}>
      <div className="shell">
        <aside className="side">
          <Brand />
          <nav className="nav">
            {sideTabs.map(([k, b], i) => (
              <button key={k} className={navKey === k ? 'on' : ''} onClick={() => go(k)}>
                <Icon name={k} /><span>{t.nav[k]}</span>{b ? <span className="badge">{b}</span> : null}
                <span className="n">0{i + 1}</span>
              </button>
            ))}
          </nav>
          <button className="btn solid block side-qr" onClick={() => setScanOpen(true)}><Icon name="qr" /> {O[lang].qrCenter}</button>
          <div className="side-foot"><ThemePicker /><Langs /></div>
        </aside>
        <header className="topbar"><Brand /><button onClick={() => go('profile')} aria-label="profile"><Avatar profile={profile} size={32} /></button></header>
        <main className="main" key={route.page + (route.id || '')}><div className="page">{view}</div></main>
        <nav className="tabbar">
          {tabs.map(([k, b]) => k === 'qr' ? (
            <button key={k} className="tab-qr" aria-label="QR" onClick={() => setScanOpen(true)}><span><Icon name="qr" /></span></button>
          ) : (
            <button key={k} className={navKey === k ? 'on' : ''} onClick={() => go(k)}>
              <Icon name={k} />{t.nav[k]}{b ? <span className="badge">{b}</span> : null}
            </button>
          ))}
        </nav>
      </div>
      {toast && <div className="toast">{toast}</div>}
      {qrOrder && <QrSheet lang={lang} t={t} order={qrOrder} onClose={() => setQrId(null)} onPay={(o) => setPayFor(o)} onChat={(o) => setChatFor(o)} onUpdate={upsertOrder} />}
      {payFor && <PaySheet lang={lang} order={payFor} onClose={() => setPayFor(null)} onPaid={(r, coins) => { upsertOrder(r); setPayFor(null); notify(coins ? `${O[lang].paid} · +${coins} 🪙` : O[lang].cashNote) }} />}
      {chatFor && <ChatSheet lang={lang} t={t} order={chatFor} me={me} staffMode={staff && chatFor.user_id !== uid} onClose={() => { markSeen(chatFor.id); setChatFor(null); loadMsgs() }} />}
      {reqOpen && <AdminRequestSheet lang={lang} onClose={() => setReqOpen(false)} onSent={(r) => { setMyReq(r); setReqOpen(false); notify(O[lang].reqSent) }} />}
      {scanOpen && <ScanSheet lang={lang} t={t} staff={staff} orders={orders} onClose={() => setScanOpen(false)} onRedeemed={(r) => { upsertOrder(r); notify(O[lang].ok) }} onShowQr={(o) => { setScanOpen(false); setQr(o) }} />}
      {editing && <ProfileEditor lang={lang} profile={profile} onClose={() => setEditing(false)} onSaved={(pr) => { setProfile(pr); setEditing(false); notify(A[lang].saved) }} />}
    </Ctx.Provider>
  )
}
