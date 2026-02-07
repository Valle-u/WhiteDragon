import { gsap } from 'gsap'

export function initHeroAnimation() {
  const hero = document.querySelector('.hero')
  if (!hero) return

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from('.hero__badge', {
    opacity: 0,
    y: 20,
    duration: 0.6,
  })
  .from('.hero__title', {
    opacity: 0,
    y: 40,
    duration: 0.8,
  }, '-=0.3')
  .from('.hero__subtitle', {
    opacity: 0,
    y: 30,
    duration: 0.7,
  }, '-=0.4')
  .from('.hero__actions .btn', {
    opacity: 0,
    y: 20,
    stagger: 0.15,
    duration: 0.6,
  }, '-=0.3')
  .from('.hero__canvas', {
    opacity: 0,
    duration: 1.2,
  }, '-=0.8')
}
