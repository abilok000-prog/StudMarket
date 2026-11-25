import { useApp } from '../context/AppContext.js'

export function Brand() {
  const { t } = useApp()
  return <div className="brand"><span className="logo">S</span><span>Stud<em>Market</em></span><small>{t.tagline}</small></div>
}
