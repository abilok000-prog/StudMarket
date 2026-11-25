import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { setupNativeChrome } from './lib/platform.js'
import './styles.css'

setupNativeChrome()
createRoot(document.getElementById('root')).render(<App />)
