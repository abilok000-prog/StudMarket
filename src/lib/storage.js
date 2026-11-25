export const KEY = 'studmarket.v2'

export function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
