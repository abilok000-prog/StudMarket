import { SvcIcon } from '../components/SvcIcon.jsx'
import { useApp } from '../context/AppContext.js'
import { SERVICE_IDS } from '../data/catalog.js'
import { Locker } from './services/Locker.jsx'
import { Lost } from './services/Lost.jsx'
import { Print } from './services/Print.jsx'
import { Skill } from './services/Skill.jsx'
import { Tech } from './services/Tech.jsx'

export function ServiceList() {
  const { t, go } = useApp()
  return (
    <ol className="toc">
      {SERVICE_IDS.map((id, i) => (
        <li key={id}>
          <button onClick={() => go('service', { id })}>
            <SvcIcon id={id} />
            <span className="toc-name">{t.services[id].name}<span className="toc-desc">{t.services[id].desc}</span></span>
            <span className="toc-go">{t.open} →</span>
          </button>
        </li>
      ))}
    </ol>
  )
}

export function Services() {
  const { t } = useApp()
  return (
    <>
      <div className="svc-head"><span className="kicker">{t.index}</span><h1 className="h1">{t.nav.services}</h1></div>
      <ServiceList />
    </>
  )
}

/* ───────── Service pages ───────── */
export function Service({ id }) {
  const { t, go } = useApp()
  const s = t.services[id]
  const n = SERVICE_IDS.indexOf(id) + 1
  const Body = { locker: Locker, tech: Tech, print: Print, lost: Lost, skill: Skill }[id]
  return (
    <>
      <div className="svc-head">
        <button className="backlink" onClick={() => go('services')}>{t.back}</button>
        <SvcIcon id={id} lg />
        <span className="kicker">{s.desc}</span>
        <h1 className="h1">{s.name}</h1>
        <p className="lead">{s.long}</p>
      </div>
      <Body />
    </>
  )
}
