# Reglas de mantenimiento frontend

Estas reglas son obligatorias para mantener el proyecto ordenado y evitar errores de rutas/estilos.

## 1) Estructura por página (fuente de verdad)

- Cada HTML usa **un único entry script** en `src/js/pages/*.js`.
- Cada entry de página es responsable de:
  - importar `../main.js` (base global),
  - importar CSS específico de la página si aplica,
  - inicializar solo los módulos que la página necesita.

Mapa actual:

- `index.html` -> `src/js/pages/home.js`
- `plataforma.html` -> `src/js/pages/plataforma.js`
- `integraciones.html` -> `src/js/pages/integraciones.js`
- `cumplimiento.html` -> `src/js/pages/cumplimiento.js`
- `empresa.html` -> `src/js/pages/empresa.js`
- `contacto.html` -> `src/js/pages/contacto.js`
- `legal/terminos.html` -> `src/js/pages/legal.js`
- `legal/privacidad.html` -> `src/js/pages/legal.js`
- `legal/cookies.html` -> `src/js/pages/legal.js`

## 2) Reglas de CSS

- `partials/head.html` es la fuente de verdad para cargar `src/css/main.css`.
- `src/css/main.css` solo contiene estilos globales y componentes compartidos.
- CSS de página vive en `src/css/pages/` y se importa desde su entry JS.
- Prohibido agregar estilos inline largos en HTML.
  - Si supera 1-2 propiedades, mover a archivo CSS.

## 3) Reglas de rutas y assets

- En HTML usar rutas absolutas desde root (`/src/...`).
- En JS usar imports relativos correctos según carpeta.
- Cuando se agregue un asset nuevo, validar que exista con build (`npm run build`).

## 4) Checklist obligatorio por cada cambio

1. Confirmar archivo entry de página impactada.
2. Confirmar import de CSS de página (si aplica).
3. Confirmar que no queden módulos huérfanos sin uso.
4. Ejecutar `npm run build`.
5. Verificar visual en:
   - reload duro (`Ctrl+F5`),
   - navegación interna entre páginas.

## 5) Convención de cambios futuros

- No duplicar inicializaciones en HTML.
- No mezclar lógica global con lógica de página.
- Si un bloque visual se elimina del HTML, eliminar su CSS/JS asociado en la misma tarea.
