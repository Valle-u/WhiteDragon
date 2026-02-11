# Backend de contacto con Resend

Este proyecto usa `server/index.js` para recibir el formulario de contacto y enviar el email mediante Resend.

## 1) Configurar variables de entorno

1. Copie `.env.example` a `.env`.
2. Configure estos valores:

- `RESEND_API_KEY`: API key de Resend (`re_...`)
- `MAIL_FROM`: remitente de salida
- `MAIL_TO`: destino final del formulario

Para este proyecto:

- `MAIL_TO=ceo@whitedragonsoftware.com`

### Notas sobre `MAIL_FROM`

- En pruebas puede usar `onboarding@resend.dev` (Resend aplica restricciones de envio).
- En produccion use un remitente de dominio verificado en Resend, por ejemplo:
  - `Whitedragonsoftware Website <no-reply@whitedragonsoftware.com>`

## 2) Ejecutar en desarrollo

- Frontend + backend juntos:

```bash
npm run dev:full
```

- Solo backend:

```bash
npm run dev:api
```

El frontend usa proxy de Vite (`/api` -> `http://localhost:8787`).

## 3) Endpoint

- `POST /api/contact`
- `GET /api/health`

## 4) Produccion

1. Build del frontend: `npm run build`
2. Levantar backend: `npm run start`

El servidor expone API y, si existe `dist`, tambien sirve los archivos estaticos.
