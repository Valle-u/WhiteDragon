export function initCookieBanner() {
  if (localStorage.getItem('wd-cookies-accepted')) return

  const banner = document.createElement('div')
  banner.className = 'cookie-banner glass'
  banner.innerHTML = `
    <div class="cookie-banner__content">
      <p class="cookie-banner__text">
        Utilizamos cookies esenciales para el funcionamiento del sitio.
        Puede consultar nuestra <a href="/legal/cookies.html">política de cookies</a> para más información.
      </p>
      <div class="cookie-banner__actions">
        <button class="btn btn-primary btn-sm" id="cookieAccept">Aceptar</button>
        <button class="btn btn-ghost btn-sm" id="cookieReject">Solo necesarias</button>
      </div>
    </div>
  `
  document.body.appendChild(banner)

  // Show with animation
  requestAnimationFrame(() => {
    banner.classList.add('visible')
  })

  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem('wd-cookies-accepted', 'all')
    banner.classList.remove('visible')
    setTimeout(() => banner.remove(), 400)
  })

  document.getElementById('cookieReject').addEventListener('click', () => {
    localStorage.setItem('wd-cookies-accepted', 'essential')
    banner.classList.remove('visible')
    setTimeout(() => banner.remove(), 400)
  })
}
