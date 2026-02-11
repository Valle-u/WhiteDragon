import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initScrollAnimations() {
  // Animate sections on scroll
  gsap.utils.toArray('.section').forEach(section => {
    gsap.from(section.querySelectorAll('[data-gsap="fade-up"]'), {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 36,
      duration: 0.95,
      stagger: 0.1,
      ease: 'power2.out',
    })
  })

  // Stagger cards
  gsap.utils.toArray('.cards-grid').forEach(grid => {
    if (grid.dataset.noStagger === 'true') return

    const cards = Array.from(grid.querySelectorAll('.glass-card')).filter(card => !card.classList.contains('feature-card'))
    if (!cards.length) return

    gsap.from(cards, {
      scrollTrigger: {
        trigger: grid,
        start: 'top 88%',
      },
      opacity: 0,
      y: 28,
      stagger: 0.09,
      duration: 0.85,
      ease: 'power2.out',
    })
  })

  // Parallax for dashboard mockup
  const mockup = document.querySelector('.dashboard-mockup')
  if (mockup) {
    gsap.to(mockup, {
      scrollTrigger: {
        trigger: mockup.closest('.section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      y: -60,
      ease: 'none',
    })
  }

  // Hero-like reveal for highlighted section titles
  gsap.utils.toArray('[data-hero-reveal]').forEach((el) => {
    // Safety: ensure title is visible by default
    gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' })

    const rect = el.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight && rect.bottom > 0

    if (isInView) {
      gsap.fromTo(el, {
        opacity: 0,
        y: 24,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.15,
      })
      return
    }

    gsap.fromTo(el, {
      opacity: 0,
      y: 24,
    }, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      immediateRender: false,
      ease: 'power2.out',
    })
  })
}
