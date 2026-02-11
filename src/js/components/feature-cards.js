export function initFeatureCards() {
  const cards = document.querySelectorAll('.feature-card')
  if (!cards.length) return

  cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const px = x / rect.width
      const py = y / rect.height

      const rotateY = (px - 0.5) * 12
      const rotateX = (0.5 - py) * 10

      card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`)
      card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`)
      card.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`)
      card.style.setProperty('--my', `${(py * 100).toFixed(2)}%`)
      card.classList.add('is-interactive')
    })

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg')
      card.style.setProperty('--ry', '0deg')
      card.style.setProperty('--mx', '50%')
      card.style.setProperty('--my', '50%')
      card.classList.remove('is-interactive')
    })
  })
}
