# 🏥 MediCore — Sistema Médico Integral

Sistema fullstack completo de gestión médica desarrollado con **Node.js + TypeScript** (backend) y **React + TypeScript** (frontend).

---

## 🛠 Tecnologías

### Backend
- Node.js + Express + TypeScript
- SQLite con `sql.js` (sin dependencias nativas — funciona en Windows sin configuración)
- Express Validator
- UUID

### Frontend
- React 18 + TypeScript + Vite
- React Router v6
- Axios
- Tipografías: Syne + Outfit + JetBrains Mono
- Diseño dark glassmorphism premium

---

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js >= 18

### Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 📡 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/stats` | Estadísticas globales del sistema |
| GET/POST | `/areas` | Listar / Crear áreas |
| GET/PUT/DELETE | `/areas/:id` | Obtener / Actualizar / Eliminar área |
| GET/POST | `/doctors` | Listar / Crear doctores |
| GET/PUT/DELETE | `/doctors/:id` | Obtener / Actualizar / Eliminar doctor |
| GET/POST | `/patients` | Listar / Crear pacientes |
| GET/PUT/DELETE | `/patients/:id` | Obtener / Actualizar / Eliminar paciente |
| GET/POST | `/appointments` | Listar / Crear citas |
| GET/PUT/DELETE | `/appointments/:id` | Obtener / Actualizar / Eliminar cita |
| PATCH | `/appointments/:id/status` | Cambiar estado de cita |

---

## 📁 Estructura del proyecto

```
medical-appointments-v4/
├── backend/
│   └── src/
│       ├── controllers/   # Lógica HTTP de todos los endpoints
│       ├── db/            # Configuración SQLite con sql.js
│       ├── middlewares/   # Validación con Express Validator
│       ├── models/        # Interfaces TypeScript
│       ├── routes/        # Definición de rutas
│       └── services/      # Lógica de negocio y acceso a datos
└── frontend/
    └── src/
        ├── components/    # Sidebar, Modal, FormField, Cards, Toast
        ├── screens/       # Dashboard, Citas, Pacientes, Doctores, Áreas
        ├── services/      # Cliente Axios
        └── types/         # Tipos TypeScript compartidos
```

---

## ✅ Funcionalidades

### Módulos del sistema
- **📊 Dashboard** — Estadísticas globales + tabla de citas recientes
- **📅 Citas** — CRUD completo, filtros por estado, buscador en tiempo real
- **👤 Pacientes** — Registro con datos personales, edad calculada, búsqueda
- **🩺 Doctores** — Gestión con especialidad, área y estado activo/inactivo
- **🏥 Áreas** — Áreas médicas con color identificador personalizable

### Características técnicas
- TypeScript en todo el proyecto (frontend + backend)
- Persistencia real con SQLite (archivo `.db`)
- Relaciones entre entidades (citas ↔ pacientes ↔ doctores ↔ áreas)
- Validación de formularios con Express Validator
- Estados de carga (spinners)
- Toast notifications con animación
- Diseño responsivo dark-mode glassmorphism
- Animaciones de entrada escalonadas
- Sidebar con navegación activa

---

Desarrollado para la prueba técnica de **WoowTechnology** 🚀
