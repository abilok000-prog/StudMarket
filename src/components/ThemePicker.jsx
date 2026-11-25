import { useApp } from '../context/AppContext.js'

export const THEMES = [
  ['aurora', 'Aurora', 'linear-gradient(135deg,#5b5bf0,#c084fc)'],
  ['midnight', 'Midnight', 'linear-gradient(135deg,#1a1b24,#7c3aed)'],
]

export function ThemePicker() {
  const { theme, setTheme } = useApp()
  return (
    <div className="themes">
      {THEMES.map(([k, n, g]) => (
        <button key={k} className={`theme-chip ${theme === k ? 'on' : ''}`} onClick={() => setTheme(k)}><i style={{ background: g }} />{n}</button>
      ))}
    </div>
  )
}
