# 005 · React Router + Header con menú de usuario

**Estado:** implementado ✅

## Qué hace

Agrega navegación interna con React Router v6 y un Header con menú de usuario que muestra el nombre, rol y opción de cerrar sesión, además de enlaces a las secciones principales de la aplicación.

## Por qué

Sin navegación interna, la aplicación dependía de archivos HTML estáticos (index.html, register.html). Esta feature permite una experiencia SPA con rutas protegidas y navegación dinámica.

## Criterios de aceptación

- [ ] El Header muestra el nombre del usuario autenticado y su rol (customer/provider/admin).
- [ ] El menú incluye un botón de cerrar sesión que elimina el token JWT.
- [ ] Las rutas protegidas redirigen a `/login` si no hay token.
- [ ] Las rutas disponibles son: `/` (BusinessList), `/negocios` (BusinessList), `/registrar-negocio` (CreateBusiness), `/experiencia/crear` (ExperienceCreate).
- [ ] Los componentes se renderizan correctamente en todas las rutas.

## Fuera de alcance

- Páginas de login y registro (se mantienen como HTML estático por ahora).
- Diseño responsive avanzado.
