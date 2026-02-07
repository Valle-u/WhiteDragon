import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]')
  if (!counters.length) return

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.counter, 10)
    const suffix = counter.dataset.suffix || ''
    const prefix = counter.dataset.prefix || ''

    const obj = { val: 0 }

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = prefix + Math.floor(obj.val).toLocaleString('es-ES') + suffix
          },
        })
      },
    })
  })
}
