# Localify
Plataforma para que negocios publiquen experiencias locales (tours, talleres, actividades) y clientes las descubran, reserven y paguen.

## Stack
- Lenguaje: JavaScript (ES Modules)
- Framework / runtime: Node.js + Express 4.18 (backend), React 19 + Vite 7 (frontend)
- Base de datos: MySQL con mysql2 (sin ORM)
- Tests: Jest + Supertest

## Comandos
- `npm run dev` — arranca el servidor en local (frontend y backend con nodemon)
- `npm test` — ejecuta los tests (deben pasar antes de cada commit)
- `npm run lint` — revisa el estilo (antes de cada PR)
- `npm run build` — compila para producción

## Estructura del proyecto
- `Backend/Gateways/ApiGateway/` — API Gateway que orquesta y redirige peticiones a microservicios
- `Backend/Services/AuthService/` — Autenticación y registro (JWT, bcryptjs, Joi)
- `Backend/Services/BusinessService/` — CRUD de negocios, subida de logos
- `Backend/Services/BookingService/` — Gestión de reservas (scaffold)
- `Backend/Services/ExperienceService/` — CRUD de experiencias
- `Backend/Services/NotificationService/` — Notificaciones (scaffold)
- `Backend/Services/PaymentService/` — Pagos (scaffold)
- `Backend/Services/UserService/` — Gestión de usuarios y perfiles
- `frontend/src/` — Aplicación React (componentes, páginas, servicios HTTP)
- `datebaseScript.sql` — Script DDL de la base de datos MySQL

## Convenciones
- camelCase para variables y funciones; PascalCase para componentes React.
- Tests en carpeta `__tests__/` dentro de cada servicio.
- Manejo de errores con middleware global de Express.
- Patrón DAO + Service + Controller en el backend.

## No hagas
- No subir archivos .env al repositorio.
- No instalar nuevas dependencias sin consultar.
- Validar toda entrada del usuario con Joi (JS no tiene tipos).
- No hardcodear secrets; usar variables de entorno siempre.

## Flujo de trabajo
- Antes de una tarea no trivial, propón un plan y espera mi OK.
- Una tarea a la vez; al terminar, dime qué cambiaste para que lo revise.
- Si no estás seguro al 80%, pregunta. No inventes.

## Documentación
- `spec/constitution/mission.md` — Misión y principios del proyecto.
- `spec/constitution/tech-stack.md` — Stack técnico y convenciones detalladas.
- `spec/constitution/roadmap.md` — Roadmap de features.
- `spec/features/` — Especificaciones, planes y tareas por feature.
