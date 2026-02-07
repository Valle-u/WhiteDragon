import { gsap } from 'gsap'

export function initPageTransitions() {
  // Entry animation
  gsap.from('main', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power2.out',
    delay: 0.1,
  })

  // Exit animation on internal link click
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]')
    if (!link) return
    if (link.target === '_blank') return
    if (link.origin !== window.location.origin) return
    if (link.hash && link.pathname === window.location.pathname) return

    e.preventDefault()
    const href = link.href

    gsap.to('main', {
      opacity: 0,
      y: -15,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        window.location.href = href
      },
    })
  })
}
