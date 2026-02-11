import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import dotenv from 'dotenv'
import { Resend } from 'resend'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 8787)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')

app.use(express.json({ limit: '1mb' }))

const corsOrigin = process.env.CORS_ORIGIN?.trim()
if (corsOrigin) {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', corsOrigin)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return
    }

    next()
  })
}

function clean(value) {
  return String(value ?? '').trim()
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizePayload(rawBody) {
  const payload = {
    company: clean(rawBody.company),
    jurisdiction: clean(rawBody.jurisdiction),
    website: clean(rawBody.website),
    contactName: clean(rawBody.contactName),
    email: clean(rawBody.email).toLowerCase(),
    message: clean(rawBody.message),
    b2bConfirm: Boolean(rawBody.b2bConfirm),
  }

  if (!payload.company || !payload.jurisdiction || !payload.contactName || !payload.email) {
    return { error: 'Por favor complete los campos obligatorios.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(payload.email)) {
    return { error: 'El correo electronico no es valido.' }
  }

  if (!payload.b2bConfirm) {
    return { error: 'Debe confirmar que representa a un operador o partner B2B.' }
  }

  if (payload.website) {
    try {
      const normalized = /^https?:\/\//i.test(payload.website)
        ? payload.website
        : `https://${payload.website}`
      payload.website = new URL(normalized).toString()
    } catch {
      return { error: 'El sitio web no tiene un formato valido.' }
    }
  }

  if (payload.message.length > 3000) {
    return { error: 'El mensaje es demasiado largo (maximo 3000 caracteres).' }
  }

  return { payload }
}

let resendClient = null

function getResendClient() {
  if (resendClient) return resendClient

  const apiKey = clean(process.env.RESEND_API_KEY)
  if (!apiKey) {
    throw new Error('RESEND_API_KEY es obligatorio para enviar correos.')
  }

  resendClient = new Resend(apiKey)
  return resendClient
}

function parseRecipientList(value) {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'contact-api', provider: 'resend' })
})

app.post('/api/contact', async (req, res) => {
  const { payload, error } = normalizePayload(req.body ?? {})
  if (error) {
    res.status(400).json({ ok: false, message: error })
    return
  }

  const mailFrom = clean(process.env.MAIL_FROM) || 'Whitedragonsoftware Website <onboarding@resend.dev>'
  const recipients = parseRecipientList(clean(process.env.MAIL_TO) || 'ceo@whitedragonsoftware.com')

  if (!recipients.length) {
    res.status(500).json({ ok: false, message: 'Falta configurar MAIL_TO.' })
    return
  }

  const messageText = payload.message || 'Sin mensaje adicional.'
  const subject = `[Contacto Web] ${payload.company} - ${payload.contactName}`

  const textBody = [
    'Nueva solicitud de contacto B2B',
    '',
    `Empresa: ${payload.company}`,
    `Jurisdiccion: ${payload.jurisdiction}`,
    `Sitio web: ${payload.website || 'No informado'}`,
    `Nombre de contacto: ${payload.contactName}`,
    `Email: ${payload.email}`,
    `Confirmacion B2B: ${payload.b2bConfirm ? 'Si' : 'No'}`,
    '',
    'Mensaje:',
    messageText,
  ].join('\n')

  const htmlBody = `
    <h2>Nueva solicitud de contacto B2B</h2>
    <p><strong>Empresa:</strong> ${escapeHtml(payload.company)}</p>
    <p><strong>Jurisdiccion:</strong> ${escapeHtml(payload.jurisdiction)}</p>
    <p><strong>Sitio web:</strong> ${escapeHtml(payload.website || 'No informado')}</p>
    <p><strong>Nombre de contacto:</strong> ${escapeHtml(payload.contactName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Confirmacion B2B:</strong> ${payload.b2bConfirm ? 'Si' : 'No'}</p>
    <hr />
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(messageText).replaceAll('\n', '<br />')}</p>
  `

  try {
    const sendResult = await getResendClient().emails.send({
      from: mailFrom,
      to: recipients,
      replyTo: payload.email,
      subject,
      text: textBody,
      html: htmlBody,
    })

    if (sendResult?.error) {
      throw new Error(sendResult.error.message || 'Resend rechazo la solicitud de envio.')
    }

    res.status(200).json({
      ok: true,
      message: 'Solicitud enviada correctamente. Nuestro equipo la revisara en breve.',
      id: sendResult?.data?.id,
    })
  } catch (sendError) {
    console.error('Error sending contact form email:', sendError)
    res.status(500).json({
      ok: false,
      message: 'No se pudo enviar la solicitud en este momento. Intente nuevamente.',
    })
  }
})

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))

  app.get('/', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`Contact backend listening on http://localhost:${port}`)
})
