# Login con botón "Iniciar Sesión" y efecto hover rainbow

## Objetivo

Crear la página de inicio de sesión funcional con un formulario de email/contraseña y un botón "Iniciar Sesión" que, al hacer hover, cicla suavemente por toda la gama de colores (efecto rainbow animado). Se integra con el endpoint `POST /api/auth/login` existente y se unifica la clave de almacenamiento del token JWT.

## Archivos afectados

### `frontend/src/pages/Login.jsx` — CREAR
- Formulario con campos email y password, cada uno con su estado local (`useState`)
- Validación de campos requeridos antes de enviar
- Llamada a `apiClient.post('/api/auth/login', { email, password })` con `includeAuth: false`
- En caso de éxito: guardar `accessToken` y `user` en localStorage, redirigir a "/"
- En caso de error: mostrar mensaje de error
- Estado `loading` para deshabilitar el botón

### `frontend/src/styles/login.css` — CREAR
- `.login-page`: contenedor full-height centrado (flexbox), fondo `#f5f5f5`
- `.login-card`: card blanca con sombra, siguiendo patrón de `business.css`
- `.login-btn`: botón primary con estilos base del proyecto
- `.login-btn:hover:not(:disabled)`: animación rainbow con `@keyframes`
- `@keyframes rainbow-hover` usando HSL (saturación 65%, luminosidad 48%)
- Ciclo completo en 4s para movimiento suave

### `frontend/src/App.jsx` — MODIFICAR
- Descomentar import y Route de Login

### `frontend/src/services/apiClient.js` — MODIFICAR
- Unificar clave token: `jwt_token` → `accessToken`

## Pasos de implementación

1. Crear `frontend/src/styles/login.css`
2. Crear `frontend/src/pages/Login.jsx`
3. Modificar `frontend/src/services/apiClient.js`
4. Modificar `frontend/src/App.jsx`
