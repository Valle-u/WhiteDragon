import { gsap } from 'gsap'

export function initHeroAnimation() {
  const hero = document.querySelector('.hero')
  if (!hero) return

  const isHome = hero.classList.contains('hero--home')

  if (isHome) {
    // Home: orchestrated entrance using gsap.to (not .from)
    // Set initial hidden states
    gsap.set('.hero__badges-row', { opacity: 0, y: 15 })
    gsap.set('.hero__title', { opacity: 0, y: 30 })
    gsap.set('.hero__subtitle', { opacity: 0, y: 20 })
    gsap.set('.hero__actions', { opacity: 0, y: 15 })
    gsap.set('.hero__stats', { opacity: 0, y: 15 })
    gsap.set('.hero__visual', { opacity: 0, x: 30 })
    gsap.set('.hero__float-card', { opacity: 0, scale: 0.85 })

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: 0.2,
    })

    tl.to('.hero__badges-row', { opacity: 1, y: 0, duration: 0.5 })
      .to('.hero__title', { opacity: 1, y: 0, duration: 0.7 }, '-=0.2')
      .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .to('.hero__actions', { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
      .to('.hero__stats', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
      .to('.hero__visual', { opacity: 1, x: 0, duration: 0.8 }, '-=0.5')
      .to('.hero__float-card', { opacity: 1, scale: 1, stagger: 0.15, duration: 0.5 }, '-=0.3')

  } else {
    // Subpages: simple entrance
    gsap.set('.hero__badge', { opacity: 0, y: 15 })
    gsap.set('.hero__title', { opacity: 0, y: 25 })
    gsap.set('.hero__subtitle', { opacity: 0, y: 15 })

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: 0.15,
    })

    tl.to('.hero__badge', { opacity: 1, y: 0, duration: 0.5 })
      .to('.hero__title', { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
      .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
  }
}
