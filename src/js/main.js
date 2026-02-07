import '../css/main.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { initNavbar } from './components/navbar.js'
import { initCookieBanner } from './components/cookie-banner.js'
import { initScrollProgress } from './animations/scroll-progress.js'
import { initMouseFollower } from './animations/mouse-follower.js'
import { initPageTransitions } from './animations/page-transitions.js'
import { initMagneticButtons } from './animations/magnetic-button.js'
import { initCardTilt } from './animations/tilt.js'

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
})

// Initialize components
initNavbar()
initCookieBanner()

// Initialize global effects
initScrollProgress()
initMouseFollower()
initPageTransitions()

// Initialize interactivity (after DOM settle)
requestAnimationFrame(() => {
  initMagneticButtons()
  initCardTilt()
})

// Set active nav link based on current page
const currentPath = window.location.pathname
const navLinks = document.querySelectorAll('.navbar__link[data-page]')
navLinks.forEach(link => {
  const page = link.dataset.page
  if (
    (page === 'home' && (currentPath === '/' || currentPath === '/index.html')) ||
    currentPath.includes(page)
  ) {
    link.classList.add('active')
  }
})
