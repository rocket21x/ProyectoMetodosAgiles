# 005 · React Router + Header con menú de usuario — Plan

## Enfoque

Integrar React Router v6 en el frontend existente para reemplazar la navegación por HTML estáticos, agregar un Header reusable con menú contextual según el rol del usuario, y proteger las rutas que requieren autenticación.

## Implementación

1. Envolver `<App/>` con `<BrowserRouter>` en `main.jsx`.
2. Definir rutas en `App.jsx` usando `<Routes>` y `<Route>` con un componente `ProtectedRoute` que verifica el token JWT.
3. Crear `components/Header.jsx` con logo, enlaces de navegación y menú desplegable de usuario (nombre, rol, logout).
4. Conectar Header con el contexto de autenticación para mostrar datos dinámicos del usuario.
5. Mover páginas existentes a componentes independientes: `BusinessList.jsx`, `CreateBusiness.jsx`, `ExperienceCreate.jsx`, `PaymentCreate.jsx`.

## Decisiones

- **React Router v6** — Se eligió sobre v5 por ser la versión actual y usar `<Routes>` en lugar de `<Switch>`.
- **ProtectedRoute** — Componente wrapper que verifica el token antes de renderizar la ruta hija; si no hay token, redirige a `/login`.

## Riesgos

- **Rutas sin paginación** — Si el proyecto crece, puede necesitar lazy loading. Mitigación: por ahora todo es carga directa, se refactorizará si el rendimiento lo requiere.
