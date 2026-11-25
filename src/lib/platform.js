/**
 * Where the app is running: the web browser, or the iOS / Android app (Capacitor).
 * Inside the app, Google blocks OAuth sign-in from WebViews, so it is hidden there.
 */
import { Capacitor } from '@capacitor/core'

export const isNativeApp = Capacitor.isNativePlatform()
export const platform = Capacitor.getPlatform() // 'web' | 'ios' | 'android'

/** Style the system status bar to match the app (no-op on the web). */
export async function setupNativeChrome() {
  if (!isNativeApp) return
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({ style: Style.Light })
    if (platform === 'android') await StatusBar.setBackgroundColor({ color: '#f2f2f7' })
  } catch {}
}
