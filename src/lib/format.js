/** Number and date formatting used across the app. */
export const fmt = (n) => (n || 0).toLocaleString('ru-RU')
export const today = () => new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })

export const ddmm = (iso) => (iso ? new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) : today())
