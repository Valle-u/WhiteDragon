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
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    })
  })

  // Stagger cards
  gsap.utils.toArray('.cards-grid').forEach(grid => {
    gsap.from(grid.querySelectorAll('.glass-card'), {
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
      },
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
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
}
