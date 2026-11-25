export const SVC_PATHS = {
  locker: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M12 3v18M9 11v2M15 11v2" /></>,
  tech: <><rect x="3" y="5" width="18" height="11" rx="1.5" /><path d="M1 19h22" /></>,
  print: <><path d="M7 8V3h10v5" /><rect x="3" y="8" width="18" height="9" rx="2" /><path d="M7 14h10v7H7z" /></>,
  lost: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  skill: <><path d="M12 3 2 8l10 5 10-5z" /><path d="M6 10.5V16c2 2 10 2 12 0v-5.5" /></>,
}

export function SvcIcon({ id, lg }) {
  return (
    <span className={`app-icon ic-${id} ${lg ? 'lg' : ''}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{SVC_PATHS[id]}</svg>
    </span>
  )
}
