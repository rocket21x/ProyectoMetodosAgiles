# Misión

## Qué construimos

Plataforma para que negocios publiquen experiencias locales y clientes las reserven y paguen.

1. **Catálogo de experiencias** — los proveedores crean y gestionan sus ofertas (tours, talleres, actividades).
2. **Reservas y pagos** — los clientes reservan y pagan desde la plataforma.
3. **Gestión de usuarios y roles** — registro, autenticación y perfiles con roles (customer, provider, admin).

## Para quién

- Clientes que buscan experiencias locales únicas en su ciudad o destino.
- Proveedores (negocios locales) que quieren ofrecer y vender sus experiencias.
- Administradores de la plataforma que supervisan la operación.

## Principios

- **Seguridad por diseño** — JWT para autenticación, validación con Joi, contraseñas hasheadas con bcryptjs, secrets en variables de entorno.
- **Simplicidad** — JavaScript sin TypeScript, sin ORM (mysql2 directo), stack minimalista y fácil de entender.
- **Escalabilidad** — Arquitectura de microservicios con API Gateway para crecer por dominio de negocio.

## Qué NO es

- No vende productos físicos ni realiza envíos.
- No es multi-idioma (solo español por ahora).
- No tiene app móvil nativa (solo web responsive).
- No es una red social (no tiene chats, amigos ni muro social).
