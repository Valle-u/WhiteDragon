import { gsap } from 'gsap'

export function initMouseFollower() {
  if (window.matchMedia('(pointer: coarse)').matches) return
  if (window.innerWidth < 768) return

  const follower = document.createElement('div')
  follower.classList.add('mouse-follower')
  document.body.appendChild(follower)

  const xTo = gsap.quickTo(follower, 'left', { duration: 0.8, ease: 'power3.out' })
  const yTo = gsap.quickTo(follower, 'top', { duration: 0.8, ease: 'power3.out' })

  document.addEventListener('mousemove', (e) => {
    xTo(e.clientX)
    yTo(e.clientY)
  })

  // Scale up on interactive elements
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .glass-card')) {
      gsap.to(follower, { scale: 1.5, opacity: 0.12, duration: 0.3 })
    }
  })

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .glass-card')) {
      gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 })
    }
  })
}
