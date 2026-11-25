import { useApp } from '../context/AppContext.js'
import { LANGS } from '../i18n/index.js'

export function Langs() {
  const { lang, setLang } = useApp()
  return (
    <div className="langs">
      {LANGS.map((l) => <button key={l} className={l === lang ? 'on' : ''} onClick={() => setLang(l)}>{l}</button>)}
    </div>
  )
}
