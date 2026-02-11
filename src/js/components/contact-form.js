const API_ENDPOINT = '/api/contact'

export function initContactForm() {
  const form = document.getElementById('contactForm')
  if (!form) return

  const submitButton = form.querySelector('button[type="submit"]')
  const submitLabel = submitButton?.textContent ?? 'Enviar solicitud'
  const statusBox = document.getElementById('contactStatus')
  const successBox = document.getElementById('formSuccess')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    clearValidation(form)
    setStatus(statusBox, '', '')

    if (successBox) {
      successBox.hidden = true
    }

    const payload = normalizePayload(form)
    const valid = validateForm(form, payload)
    if (!valid) return

    setSubmitting(submitButton, true, submitLabel)

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await parseJsonSafe(response)

      if (!response.ok) {
        throw new Error(result.message || 'No fue posible enviar la solicitud.')
      }

      form.reset()
      setStatus(statusBox, 'success', result.message || 'Solicitud enviada correctamente.')

      if (successBox) {
        successBox.hidden = false
      }
    } catch (error) {
      setStatus(statusBox, 'error', error.message || 'Ocurrio un error al enviar la solicitud.')
    } finally {
      setSubmitting(submitButton, false, submitLabel)
    }
  })
}

function normalizePayload(form) {
  const company = form.querySelector('#company')?.value?.trim() ?? ''
  const jurisdiction = form.querySelector('#jurisdiction')?.value?.trim() ?? ''
  const websiteRaw = form.querySelector('#website')?.value?.trim() ?? ''
  const contactName = form.querySelector('#contactName')?.value?.trim() ?? ''
  const email = form.querySelector('#email')?.value?.trim() ?? ''
  const message = form.querySelector('#message')?.value?.trim() ?? ''
  const b2bConfirm = Boolean(form.querySelector('#b2bConfirm')?.checked)

  return {
    company,
    jurisdiction,
    website: websiteRaw,
    contactName,
    email,
    message,
    b2bConfirm,
  }
}

function validateForm(form, payload) {
  let isValid = true

  const requiredFieldIds = ['company', 'jurisdiction', 'contactName', 'email']
  requiredFieldIds.forEach((fieldId) => {
    const field = form.querySelector(`#${fieldId}`)
    if (!field) return

    if (!field.value.trim()) {
      isValid = false
      field.classList.add('error')
      showFieldError(field, 'Este campo es obligatorio.')
    }
  })

  if (payload.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payload.email)) {
      isValid = false
      const emailField = form.querySelector('#email')
      if (emailField) {
        emailField.classList.add('error')
        showFieldError(emailField, 'Ingrese un correo electronico valido.')
      }
    }
  }

  if (payload.website) {
    const websiteField = form.querySelector('#website')
    try {
      const normalized = /^https?:\/\//i.test(payload.website)
        ? payload.website
        : `https://${payload.website}`
      const parsed = new URL(normalized)

      if (websiteField) {
        websiteField.value = parsed.toString()
      }
      payload.website = parsed.toString()
    } catch {
      isValid = false
      if (websiteField) {
        websiteField.classList.add('error')
        showFieldError(websiteField, 'Ingrese una URL valida (ejemplo: https://...).')
      }
    }
  }

  if (payload.message.length > 3000) {
    isValid = false
    const messageField = form.querySelector('#message')
    if (messageField) {
      messageField.classList.add('error')
      showFieldError(messageField, 'El mensaje no puede superar 3000 caracteres.')
    }
  }

  const b2bCheckbox = form.querySelector('#b2bConfirm')
  const b2bWrap = form.querySelector('#b2bConfirmWrap')
  if (b2bWrap) {
    b2bWrap.classList.remove('is-error')
  }

  if (!payload.b2bConfirm) {
    isValid = false
    if (b2bWrap) {
      b2bWrap.classList.add('is-error')
    }
    if (b2bCheckbox) {
      b2bCheckbox.focus()
    }
  }

  return isValid
}

function clearValidation(form) {
  form.querySelectorAll('.form-input, .form-textarea').forEach((field) => {
    field.classList.remove('error')
  })

  form.querySelectorAll('.form-error').forEach((error) => {
    error.remove()
  })

  const b2bWrap = form.querySelector('#b2bConfirmWrap')
  if (b2bWrap) {
    b2bWrap.classList.remove('is-error')
  }
}

function showFieldError(field, message) {
  const parent = field.parentElement
  if (!parent) return

  const existingError = parent.querySelector('.form-error')
  if (existingError) {
    existingError.remove()
  }

  const error = document.createElement('span')
  error.className = 'form-error'
  error.textContent = message
  parent.appendChild(error)
}

function setStatus(statusBox, type, message) {
  if (!statusBox) return

  statusBox.classList.remove('is-success', 'is-error')

  if (!type || !message) {
    statusBox.hidden = true
    statusBox.textContent = ''
    return
  }

  statusBox.classList.add(type === 'success' ? 'is-success' : 'is-error')
  statusBox.textContent = message
  statusBox.hidden = false
}

function setSubmitting(button, isSubmitting, defaultLabel) {
  if (!button) return

  button.disabled = isSubmitting
  button.textContent = isSubmitting ? 'Enviando...' : defaultLabel
}

async function parseJsonSafe(response) {
  try {
    return await response.json()
  } catch {
    return {}
  }
}
