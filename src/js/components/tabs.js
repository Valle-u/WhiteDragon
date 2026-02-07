import { gsap } from 'gsap'

export function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach((container) => {
    const buttons = container.querySelectorAll('[data-tab-btn]')
    const panels = container.querySelectorAll('[data-tab-panel]')

    if (!buttons.length || !panels.length) return

    // Show first panel, hide rest
    panels.forEach((p, i) => {
      if (i > 0) {
        p.style.display = 'none'
        p.style.opacity = '0'
      }
    })

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tabBtn
        const activePanel = container.querySelector('[data-tab-panel]:not([style*="display: none"])')
        const targetPanel = container.querySelector(`[data-tab-panel="${target}"]`)

        if (activePanel === targetPanel) return

        // Update active button
        buttons.forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')

        // Animate out current
        gsap.to(activePanel, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          onComplete: () => {
            activePanel.style.display = 'none'
            targetPanel.style.display = 'block'
            gsap.fromTo(
              targetPanel,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            )
          },
        })
      })
    })

    // Set first button active
    if (buttons[0]) buttons[0].classList.add('active')
  })
}
