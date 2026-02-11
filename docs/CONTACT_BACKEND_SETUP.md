# Backend de contacto con Resend

Este proyecto usa `server/index.js` para recibir el formulario de contacto y enviar el email mediante Resend.

## 1) Configurar variables de entorno

1. Copie `.env.example` a `.env`.
2. Configure estos valores:

- `RESEND_API_KEY`: API key de Resend (`re_...`)
- `MAIL_FROM`: remitente de salida
- `MAIL_TO`: destino final del formulario
- `CORS_ORIGIN`: origen permitido para llamadas del frontend (uno o varios separados por coma)

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

### Frontend estatico en otro dominio/hosting

Si publicas el frontend en un hosting estatico distinto del backend (por ejemplo Hostinger + Render), define durante el build del frontend:

- `VITE_CONTACT_API_URL=https://tu-backend.onrender.com`

Y en el backend configura `CORS_ORIGIN` para permitir ese dominio del frontend.
