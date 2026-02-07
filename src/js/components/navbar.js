export function initNavbar() {
  const navbar = document.getElementById('navbar')
  const hamburger = document.getElementById('hamburger')
  const mobileMenu = document.getElementById('mobileMenu')

  if (!navbar) return

  // Scroll behavior - add glass effect
  let lastScroll = 0
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY

    if (currentScroll > 50) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }

    lastScroll = currentScroll
  })

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active')
      mobileMenu.classList.toggle('active')
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : ''
    })

    // Close menu on link click
    mobileMenu.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active')
        mobileMenu.classList.remove('active')
        document.body.style.overflow = ''
      })
    })
  }
}
