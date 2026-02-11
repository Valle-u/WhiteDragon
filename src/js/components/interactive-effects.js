export function initInteractiveEffects() {
  const root = document.documentElement
  let raf = null
  let isPointerAnimating = false
  let stickyRaf = null
  let targetX = 50
  let targetY = 50
  let currentX = 50
  let currentY = 50

  root.style.setProperty('--pointer-x', `${currentX.toFixed(2)}%`)
  root.style.setProperty('--pointer-y', `${currentY.toFixed(2)}%`)

  function renderPointer() {
    currentX += (targetX - currentX) * 0.08
    currentY += (targetY - currentY) * 0.08
    root.style.setProperty('--pointer-x', `${currentX.toFixed(2)}%`)
    root.style.setProperty('--pointer-y', `${currentY.toFixed(2)}%`)

    const doneX = Math.abs(targetX - currentX) < 0.03
    const doneY = Math.abs(targetY - currentY) < 0.03

    if (doneX && doneY) {
      isPointerAnimating = false
      raf = null
      return
    }

    raf = requestAnimationFrame(renderPointer)
  }

  function schedulePointerRender() {
    if (isPointerAnimating) return
    isPointerAnimating = true
    raf = requestAnimationFrame(renderPointer)
  }

  function onPointerMove(event) {
    targetX = (event.clientX / window.innerWidth) * 100
    targetY = (event.clientY / window.innerHeight) * 100
    schedulePointerRender()
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })

  const useFinePointer = !window.matchMedia('(pointer: coarse)').matches

  if (useFinePointer) {
    document.querySelectorAll('.interactive-card').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        card.style.setProperty('--card-rx', `${(-y * 5).toFixed(2)}deg`)
        card.style.setProperty('--card-ry', `${(x * 6).toFixed(2)}deg`)
      })

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--card-rx', '0deg')
        card.style.setProperty('--card-ry', '0deg')
      })
    })
  }

  const stickyCta = document.getElementById('stickyCta')
  const footer = document.querySelector('footer')
  function updateStickyCta() {
    if (!stickyCta) return
    const doc = document.documentElement
    const maxScroll = doc.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) : 0
    let footerVisible = false
    if (footer) {
      const footerRect = footer.getBoundingClientRect()
      footerVisible = footerRect.top < window.innerHeight - 40
    }

    const shouldShow = progress >= 0.8 && !footerVisible

    stickyCta.classList.toggle('is-visible', shouldShow)
    stickyCta.setAttribute('aria-hidden', shouldShow ? 'false' : 'true')
  }

  function scheduleStickyUpdate() {
    if (stickyRaf) return
    stickyRaf = requestAnimationFrame(() => {
      stickyRaf = null
      updateStickyCta()
    })
  }

  window.addEventListener('scroll', scheduleStickyUpdate, { passive: true })
  window.addEventListener('resize', scheduleStickyUpdate)
  updateStickyCta()

  return () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('scroll', scheduleStickyUpdate)
    window.removeEventListener('resize', scheduleStickyUpdate)
    if (stickyRaf) cancelAnimationFrame(stickyRaf)
    if (raf) cancelAnimationFrame(raf)
  }
}
