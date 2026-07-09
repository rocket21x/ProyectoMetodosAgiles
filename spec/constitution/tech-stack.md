# Tech stack y convenciones

## Tecnologías

- **Lenguaje:** JavaScript (ES Modules)
- **Framework / runtime:** Node.js + Express 4.18 (backend), React 19 + Vite 7 (frontend)
- **Base de datos:** MySQL con mysql2 (sin ORM)
- **Tests:** Jest + Supertest
- **Despliegue:** <por definir>

## Archivos / módulos clave

- `Backend/Gateways/ApiGateway/src/server.js` — Entry point del API Gateway.
- `Backend/Services/AuthService/src/server.js` — Servicio de autenticación (JWT).
- `Backend/Services/BusinessService/src/server.js` — CRUD de negocios.
- `Backend/Services/ExperienceService/server.js` — CRUD de experiencias.
- `Backend/Services/UserService/src/server.js` — Gestión de usuarios.
- `frontend/src/App.jsx` — Definición de rutas de la aplicación React.
- `frontend/src/main.jsx` — Punto de entrada del frontend.
- `datebaseScript.sql` — Script DDL completo de la base de datos.

## Comandos

- `npm run dev` — Arranca el entorno local (Vite para frontend, nodemon para backend).
- `npm test` — Ejecuta los tests con Jest.
- `npm run lint` — Revisa el estilo con ESLint.
- `npm run build` — Compila el frontend para producción con Vite.

## Modelo de datos / dominio

- **users** — Usuarios de la plataforma (id, email, password_hash, role, first_name, last_name, phone, avatar_url).
- **businesses** — Negocios/proveedores (id, user_id, business_name, email, phone, logo_image, active_state, bank_clabe).
- **customers** — Clientes (id, user_id, date_of_birth).
- **experiences** — Experiencias ofrecidas (id, business_id, title, description, price_per_person, location, meeting_point, images).
- **bookings** — Reservas (id, experience_id, customer_id, experience_date, experience_time, number_of_people, total_price, status).
- **reviews** — Reseñas (id, booking_id, experience_id, customer_id, rating, comment, created_at).
- **payments** — Pagos (id, booking_id, amount, payment_method, status, payment_date).

## Convenciones

- camelCase para variables y funciones; PascalCase para componentes React.
- Tests en carpeta `__tests__/` dentro de cada servicio.
- Manejo de errores con middleware global de Express.
- Patrón DAO + Service + Controller en el backend.
- Validación de entrada con Joi en todos los endpoints.

## Estilo visual (solo si aplica)

- <por definir>

## Límites duros

- No subir archivos .env al repositorio.
- No instalar nuevas dependencias sin consultar.
- Validar toda entrada del usuario con Joi.
- No hardcodear secrets; usar variables de entorno siempre.
