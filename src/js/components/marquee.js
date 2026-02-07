import { gsap } from 'gsap'

export function initMarquee() {
  document.querySelectorAll('[data-marquee]').forEach((container) => {
    const track = container.querySelector('.marquee__track')
    if (!track) return

    // Duplicate content for seamless loop
    track.innerHTML += track.innerHTML

    const speed = parseFloat(container.dataset.marqueeSpeed) || 30

    gsap.to(track, {
      xPercent: -50,
      duration: speed,
      ease: 'none',
      repeat: -1,
    })

    // Pause on hover
    container.addEventListener('mouseenter', () => {
      gsap.to(track, { timeScale: 0.3, duration: 0.4 })
    })
    container.addEventListener('mouseleave', () => {
      gsap.to(track, { timeScale: 1, duration: 0.4 })
    })
  })
}
