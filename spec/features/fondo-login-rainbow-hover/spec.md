# Fondo login rainbow hover

## Objetivo
Completar el efecto rainbow en el fondo de la página de login que ya está cableado en CSS pero nunca se implementó. Al hacer hover sobre el botón "Iniciar sesión", el fondo gris claro (`#f5f5f5`) debe transicionar con una animación arcoíris en colores pastel (alta luminosidad) para mantener legibilidad. El efecto existente del botón no se modifica.

## Archivos afectados
- `frontend/src/styles/login.css` — añadir `@keyframes bg-rainbow` (único cambio)

## Dependencias
Ninguna. CSS puro, sin librerías externas ni cambios en JS/JSX.

## Riesgos
- Si la luminosidad es muy baja (<85%), el fondo oscurecerá los inputs y texto blancos. Se corrige usando luminosidad 90–94%.
- `@media (prefers-reduced-motion: reduce)` ya está cubierto (líneas 91–101), no requiere cambio.
- El selector `.login-page:has(.login-btn:hover)` ya existe (línea 11). Si se elimina en el futuro, la animación deja de funcionar. No hay riesgo para esta tarea.

## Pasos de implementación
1. Abrir `frontend/src/styles/login.css`
2. Localizar el final del archivo (después de `@keyframes rainbow-hover` o después de `.error-message`)
3. Insertar el bloque `@keyframes bg-rainbow` con 7 stops HSL de alta luminosidad (90–94%) y saturación ~55%
4. Verificar que `@media (prefers-reduced-motion: reduce)` siga funcionando
5. Guardar archivo y probar con `npm run dev`

## Detalle técnico

| Elemento | Selector | Animación | Estado |
|---|---|---|---|
| Botón (existe) | `.login-btn:hover:not(:disabled)` | `rainbow-hover` | ✅ Funciona |
| Fondo (roto) | `.login-page:has(.login-btn:hover)` | `bg-rainbow` (FALTANTE) | ❌ Roto → ✅ Se añade |

Los valores HSL del nuevo keyframe usan **luminosidad 90–94%** (versus 40–50% del botón) para que el fondo se mantenga claro y los elementos encima (tarjeta blanca, inputs, texto) sigan siendo legibles sin cambiar su estilo.
