import { gsap } from 'gsap'

export function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return

  document.querySelectorAll('.glass-card').forEach((card) => {
    card.style.transformStyle = 'preserve-3d'

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      gsap.to(card, {
        rotateY: x * 12,
        rotateX: -y * 12,
        duration: 0.3,
        ease: 'power2.out',
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      })
    })
  })
}
