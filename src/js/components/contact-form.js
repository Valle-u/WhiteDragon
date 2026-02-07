export function initContactForm() {
  const form = document.getElementById('contactForm')
  if (!form) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // Clear previous errors
    form.querySelectorAll('.form-input, .form-textarea').forEach(el => {
      el.classList.remove('error')
    })
    form.querySelectorAll('.form-error').forEach(el => el.remove())

    let valid = true

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]')
    requiredFields.forEach(field => {
      if (field.type === 'checkbox') {
        if (!field.checked) {
          valid = false
          field.closest('.form-checkbox').style.outline = '1px solid var(--error)'
        } else {
          field.closest('.form-checkbox').style.outline = ''
        }
        return
      }

      if (!field.value.trim()) {
        valid = false
        field.classList.add('error')
        showError(field, 'Este campo es obligatorio')
      }
    })

    // Validate email format
    const emailField = form.querySelector('#email')
    if (emailField && emailField.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailField.value)) {
        valid = false
        emailField.classList.add('error')
        showError(emailField, 'Ingrese un correo electrónico válido')
      }
    }

    // Validate URL format if provided
    const websiteField = form.querySelector('#website')
    if (websiteField && websiteField.value.trim()) {
      try {
        new URL(websiteField.value)
      } catch {
        valid = false
        websiteField.classList.add('error')
        showError(websiteField, 'Ingrese una URL válida (ej: https://...)')
      }
    }

    if (valid) {
      // Mock submission - show success
      form.style.display = 'none'
      document.getElementById('formSuccess').style.display = 'block'
    }
  })

  function showError(field, message) {
    const existing = field.parentElement.querySelector('.form-error')
    if (existing) existing.remove()
    const error = document.createElement('span')
    error.className = 'form-error'
    error.textContent = message
    field.parentElement.appendChild(error)
  }
}
