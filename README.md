# 🏆 2026 FIFA World Cup Manager

Aplicación fullstack para gestionar datos del Mundial de Fútbol 2026 (Canada / United States / Mexico). Construida con React + Vite y Supabase como backend, con autenticación, CRUD completo, imágenes, estadísticas y datos reales del torneo.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-React-F56565?logo=lucide&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf?logo=chartdotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

---

## 🚀 Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite 8 |
| Estilos | Tailwind CSS v4 |
| Iconos | Lucide React |
| Gráficos | Recharts |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Storage | Supabase Storage |
| Routing | React Router DOM v7 |
| Deploy | Vercel |

---

## 📋 Funcionalidades

- 🔐 **Login** — Autenticación con Supabase Auth y rutas protegidas
- 📊 **Dashboard** — Estadísticas en tiempo real con datos del Mundial 2026
- 🛡️ **Equipos** — CRUD completo con bandera, confederación, grupo y ranking FIFA
- 👥 **Jugadores** — CRUD completo con foto, posición, dorsal y equipo asignado
- ⚔️ **Partidos** — Registro de partidos con resultado, fase y fecha
- 📋 **Posiciones** — Tabla de posiciones por grupo con stats completos y filtros
- 🏆 **Goleadores** — Registro de goles con ranking automático de anotadores
- 📈 **Estadísticas** — Gráficos de goles por equipo, fase, confederación, minuto y ranking de goleadores
- ⚙️ **Settings** — Estado de conexión Supabase, conteo de registros y exportación CSV
- 🔍 **Buscador** — Filtro en tiempo real en todas las páginas
- 🖼️ **Modal de imagen** — Click en cualquier imagen para verla ampliada
- 📥 **Exportar CSV** — Descarga de cualquier tabla como archivo CSV

---

## 🗄️ Base de datos

```
equipos              → id, nombre, confederacion, grupo, ranking_fifa, clasificado, imagen_url
jugadores            → id, nombre, posicion, dorsal, activo, fecha_nacimiento, imagen_url, equipo_id
partidos             → id, local_id, visitante_id, goles_local, goles_visitante, fase, fecha
goles                → id, partido_id, jugador_id, minuto, es_penal
posiciones_por_grupo → id, equipo_id, grupo, pj, pg, pe, pp, gf, gc, puntos
```

---

## ⚙️ Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/erkhur/world-cup-manager.git
cd world-cup-manager

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Levantar el servidor de desarrollo
pnpm run dev
```

---

## 🔑 Variables de entorno

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Las credenciales se obtienen en **Supabase → Project Settings → API**.

> ⚠️ Nunca subas el archivo `.env` a GitHub. Ya está incluido en `.gitignore`.

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Header.jsx
│   ├── ImagenModal.jsx
│   └── Sidebar.jsx
├── context/
│   └── AuthContext.jsx
├── layout/
│   └── AppLayout.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Equipos.jsx
│   ├── Estadisticas.jsx
│   ├── Jugadores.jsx
│   ├── Login.jsx
│   ├── Partidos.jsx
│   ├── Posiciones.jsx
│   ├── Goleadores.jsx
│   └── Settings.jsx
├── router/
│   └── index.jsx
└── utils/
    └── navigation.js
public/
├── favicon.svg
└── wc2026.png
```

---

## 🌐 Deploy en Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Agregar variables de entorno en **Vercel → Settings → Environment Variables**
3. Cada `git push` a `main` genera redeploy automático

---

## 📊 Datos del torneo

El proyecto incluye scripts SQL con datos reales del Mundial 2026:

| Script | Contenido |
|--------|-----------|
| `01_equipos` | 48 equipos con confederación, grupo y ranking FIFA |
| `02_partidos` | Partidos de fase de grupos |
| `03-05_jugadores` | Plantillas de 9 selecciones |
| `06_posiciones` | Posiciones finales de 6 grupos |
| `07_goles` | Goles reales con jugadores y minutos |
| `08_knockout` | Round of 32 y Round of 16 |
| `09_banderas` | Banderas de 48 equipos via flagcdn.com |

---

## 👨‍💻 Desarrollado por

**Coderk** · [github.com/erkhur](https://github.com/erkhur) · 2026 ™

📧 Soporte: [erkhur@gmail.com](mailto:erkhur@gmail.com)

Proyecto desarrollado en el bootcamp **Code 301 — Professional Fullstack** con Arnold.