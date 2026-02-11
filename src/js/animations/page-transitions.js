import { gsap } from 'gsap'

export function initPageTransitions() {
  // Ensure main is always visible on page load
  // (exit transition from previous page may have left it at opacity 0)
  const main = document.querySelector('main')
  if (main) {
    main.style.opacity = '1'
    main.style.transform = 'none'
  }

  // Only handle exit animation on internal link click.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]')
    if (!link) return
    if (link.target === '_blank') return
    if (link.origin !== window.location.origin) return
    if (link.hash && link.pathname === window.location.pathname) return

    e.preventDefault()
    const href = link.href
    const loader = document.getElementById('appLoader')

    gsap.to('main', {
      opacity: 0,
      y: -15,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        document.documentElement.classList.add('is-preloading')
        if (loader) loader.classList.remove('is-hiding')
        window.location.href = href
      },
    })
  })
}
