/**
 * Draws the Stud Market app icon and splash screen as SVG and renders them to PNG
 * in assets/, which `npx capacitor-assets generate` turns into every iOS/Android size.
 * Run: node scripts/make-icons.mjs
 */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

mkdirSync('assets', { recursive: true })

const GRADIENT = `
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#5b5bf0"/>
    <stop offset="0.55" stop-color="#8b5cf6"/>
    <stop offset="1" stop-color="#c084fc"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.25" cy="0.15" r="0.75">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>`

// The mark: a shopping bag whose body holds a bold "S", drawn as paths (no font needed).
// Coordinates are for a 1024x1024 box, centred on 512.
const mark = (scale = 1) => `
  <g transform="translate(512 512) scale(${scale}) translate(-512 -512)">
    <path d="M392 360 C392 270 632 270 632 360" fill="none" stroke="#fff" stroke-width="44" stroke-linecap="round"/>
    <rect x="292" y="352" width="440" height="420" rx="96" fill="#fff"/>
    <path d="M598 478 C580 438 444 430 440 500 C436 566 590 560 590 632 C590 700 450 704 422 650"
          fill="none" stroke="url(#bg)" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`

const svg = (w, h, body, bg = true) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${GRADIENT}</defs>
  ${bg ? `<rect width="${w}" height="${h}" fill="url(#bg)"/><rect width="${w}" height="${h}" fill="url(#glow)"/>` : ''}
  ${body}
</svg>`)

const out = (name, buf) => sharp(buf).png().toFile(`assets/${name}`).then(() => console.log('assets/' + name))

// iOS + legacy Android icon: full-bleed gradient with the mark
await out('icon-only.png', svg(1024, 1024, mark(1)))
// Android adaptive icon: background layer + foreground mark kept inside the safe zone
await out('icon-background.png', svg(1024, 1024, ''))
await out('icon-foreground.png', svg(1024, 1024, mark(0.62), false))
// Splash: centred mark on the gradient (light) / on the dark app background (dark)
const splashMark = `<g transform="translate(${2732 / 2 - 512} ${2732 / 2 - 512})">${mark(0.5)}</g>`
await out('splash.png', svg(2732, 2732, splashMark))
await out('splash-dark.png', Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732">
  <defs>${GRADIENT}</defs>
  <rect width="2732" height="2732" fill="#0d0e14"/>
  ${splashMark}
</svg>`))
