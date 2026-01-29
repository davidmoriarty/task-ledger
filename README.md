# TaskLedger
 
A fundamentals-first Node.js + Express application featuring session-based authentication, SQLite persistence, and a minimal server-rendered dashboard for task management.
 
This project intentionally prioritizes **core backend and web fundamentals** over framework complexity.
 
---
 
## Features
 
- Email/password authentication (register, login, logout) using sessions and bcrypt
- Protected routes with session-based access control
- Task CRUD (create, list, update, delete)
- Task status management (`active`, `completed`, `archived`)
- Server-rendered dashboard using EJS
- Input validation and consistent error handling
- Lightweight `/health` endpoint for monitoring
- SQLite persistence with a simple relational schema
 
---

## Screenshots

### Login
![Login screen](screenshots/login.png)

### Dashboard
![Dashboard view](screenshots/dashboard.png)

---
 
## Tech Stack
 
- **Node.js** 24.x (LTS)
- **Express**
- **EJS** (server-side rendering)
- **SQLite** (`better-sqlite3`)
- **Sessions**: `express-session` + `session-file-store`
- **Validation**: `zod`
- **Security / Ops**: `bcrypt`, `helmet`, `morgan`, `dotenv`
 
---
 
## Getting Started
 
### 1. Requirements
- Node.js 24.x
- npm (bundled with Node)
 
### 2. Install dependencies
    npm install
 
### 3. Configure environment variables
    cp .env.example .env
 
Edit `.env` and set:
 
    PORT=3000
    SESSION_SECRET=your_secret_here
    DB_PATH=.data/taskledger.db
 
### 4. Initialize the database
    npm run db:init
 
This creates the SQLite database and applies the schema.
 
### 5. Run the app
Development:
 
    npm run dev
 
Production:
 
    npm start
 
---
 
## Scripts
 
- `npm run dev` — run with nodemon
- `npm start` — start server
- `npm run db:init` — initialize database schema
 
---
 
## Routes
 
### API
 
- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
 
### UI
 
- `GET /ui/login`
- `GET /ui/dashboard`
- `POST /ui/tasks`
- `POST /ui/tasks/:id/toggle`
- `POST /ui/tasks/:id/delete`
 
---
 
## Project Notes
 
- This project is designed to reflect real-world Express applications commonly found in existing production codebases.
- CommonJS modules are used intentionally for compatibility and simplicity.
- The UI is intentionally minimal and server-rendered to demonstrate classic request/response flows.
- Emphasis is placed on correctness, clarity, and maintainability over novelty.
 
---
 
## License
 
MIT
