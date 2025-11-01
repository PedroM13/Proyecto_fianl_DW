# Gestor de Eventos con Registro de Participantes

Aplicación web para crear, gestionar y registrar participantes en eventos. Envía confirmación por correo al registrarse. Backend en Node.js/Express con MongoDB (Mongoose). Frontend en HTML/CSS/JS.

## Características

- CRUD de eventos (crear, listar, editar, eliminar).
- Registro de participantes por evento.
- Confirmación por correo electrónico al registrarse (Resend).
- Comprobación de capacidad (opcional) por evento.
- Seguridad opcional para endpoints de administración con `ADMIN_SECRET`.
- Frontend simple: 
  - `index.html`: listado de eventos.
  - `event.html`: detalle + registro.
  - `admin.html`: panel de administración.

## Tecnologías

- Backend: Node.js, Express, Mongoose, CORS, express-validator
- Email: Resend (SDK oficial). Si no configuras la API, el servicio hace fallback a `console.log`.
- Frontend: HTML, CSS, JavaScript.
- Infraestructura: Docker y docker-compose (con MongoDB).
  
## Estructura

```
.
├─ public/
│  ├─ index.html
│  ├─ event.html
│  ├─ admin.html
│  ├─ styles.css
│  ├─ js/
│  │  ├─ app.js
│  │  ├─ event.js
│  │  ├─ admin.js
│  │  └─ api.js
├─ src/
│  ├─ server.js
│  ├─ config/
│  │  ├─ env.js
│  │  └─ db.js
│  ├─ middleware/
│  │  └─ adminAuth.js
│  ├─ models/
│  │  ├─ Event.js
│  │  └─ Registration.js
│  ├─ routes/
│  │  ├─ events.js
│  │  └─ registrations.js
│  ├─ controllers/
│  │  ├─ eventController.js
│  │  └─ registrationController.js
│  └─ services/
│     ├─ emailService.js
│     └─ templates/
│        └─ registrationEmail.js
├─ .env.example
├─ .gitignore
├─ package.json
├─ Dockerfile
└─ docker-compose.yml
```

## Variables de entorno

Copia `.env.example` a `.env` y completa:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/events_db
RESEND_API_KEY=tu_api_key_de_resend
EMAIL_FROM=Organizador <no-reply@tudominio.com>
BASE_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
# Opcional: si lo pones, los endpoints de admin exigirán este header:
# x-admin-secret: <valor>
ADMIN_SECRET=
```

Notas:
- Si no pones `RESEND_API_KEY`, los emails se simulan por consola.
- `EMAIL_FROM` debe ser un remitente verificado en Resend para envío real.
- Si desplegarás el frontend en otro dominio/puerto, ajusta `CORS_ORIGIN`.

## Ejecución local (sin Docker)

1) Instalar dependencias:
```
npm install
```

2) Configurar `.env` (ver sección anterior).

3) Levantar MongoDB local o usar MongoDB Atlas.

4) Ejecutar en modo desarrollo:
```
npm run dev
```

5) Abrir en navegador:
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin.html
- Evento (detalle): http://localhost:3000/event.html?id=<EVENT_ID>

## Ejecución con Docker

Requisitos: Docker y Docker Compose.

1) Crear `.env` según `.env.example`. Para usar el Mongo de docker-compose, ajusta:
```
MONGODB_URI=mongodb://mongo:27017/events_db
```

2) Levantar:
```
docker compose up --build
```

3) Navegar a:
- http://localhost:3000

## API principal

- GET    /api/events
- POST   /api/events               (admin)
- GET    /api/events/:id
- PUT    /api/events/:id           (admin)
- DELETE /api/events/:id           (admin)

- POST   /api/events/:id/registrations
- GET    /api/events/:id/registrations     (admin)

Headers admin (si `ADMIN_SECRET` está definido):
- `x-admin-secret: <ADMIN_SECRET>`

## Notas de seguridad

- Este proyecto no implementa autenticación de usuarios ni panel seguro. Para prácticas reales, integra Auth (p.ej., JWT, OAuth, Firebase Auth) antes de exponer endpoints de administración.
- La validación es básica; amplíala si es necesario.

## Despliegue

- Backend: Render, Railway, Fly.io, o VPS.
- Base de datos: MongoDB Atlas recomendado.
- Frontend: Puede servirse desde el mismo Express o desde un hosting estático (Netlify/Vercel). Si separas dominios, ajusta CORS.

## Licencia

Uso educativo.
