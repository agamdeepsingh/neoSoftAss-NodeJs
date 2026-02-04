# Task Management System

Node.js REST API for tasks (create, list with pagination, update, delete) with PostgreSQL, validation, and optional Keycloak RBAC.

**Base URL:** `http://localhost:3000` (or the `PORT` in `.env`)

---

## Database credentials (.env)

I have added my **personal database credentials** in the `.env` file in this repo. You can:

- **Use the same** – Run the app as-is; the existing `.env` points to my DB (contains dummy data for testing).
- **Use your own** – Edit `.env` and change `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SCHEMA`, and `DB_SSL` to your PostgreSQL details.

No need to create a new `.env` unless you want to switch to your own database.

---

## How to run this project

### 1. Clone the repository

```bash
git clone https://github.com/agamdeepsingh/neoSoftAss-NodeJs
cd neoSoftAss-NodeJs
```

Replace `<repository-url>` with the repo URL and `<project-folder>` with the directory name (e.g. the repo name).

---

### 2. Install dependencies (Recommended node version 18)

```bash
npm install
```

---

### 3. (Optional) Change database credentials

If you want to use your own database instead of the one in `.env`:

- Open `.env` in the project root.
- Update: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SCHEMA`, and set `DB_SSL=true` for remote/cloud DBs or `DB_SSL=false` for local PostgreSQL.

---

### 4. Run the migration

This creates the `task_manager` schema and `tasks` table in PostgreSQL:

```bash
npm run db:migrate
```

You should see: `Migration 001_create_tasks.sql completed successfully.`

---

### 5. Start the application

**Development (with auto-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

---

### 6. Quick check

```bash
# Health check (200 = DB connected)
curl http://localhost:3000/health

# List tasks (paginated; default page=1, limit=10)
curl http://localhost:3000/tasks?page=1&limit=5

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task", "description": "Test", "status": "pending"}'

# Update a task (use task id from create/list)
curl -X PATCH http://localhost:3000/tasks/<task-id> \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/<task-id>
```

---

## API reference (summary)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check; returns `{ status, database }`. 503 if DB unavailable. |
| GET | `/tasks?page=1&limit=10` | List tasks (paginated). `page` and `limit` optional (defaults: 1, 10). |
| POST | `/tasks` | Create task. Body: `{ title (required), description?, status? }`. Status: `pending` \| `in-progress` \| `completed`. |
| PATCH | `/tasks/:id` | Update task. Body: at least one of `{ title?, status? }`. `id` = UUID. |
| DELETE | `/tasks/:id` | Delete task. Returns `{ success: true, response: "Deleted Successfully" }`. `id` = UUID. |

**Task object:** `id` (UUID), `title`, `description` (string or null), `status`, `created_at`, `updated_at` (ISO 8601).

**Pagination response (GET /tasks):** `{ page, limit, total, data: Task[] }`.

**Authentication (optional):** If `KEYCLOAK_ENABLED=true` in `.env`, all `/tasks` endpoints require `Authorization: Bearer <access_token>`. GET /tasks requires role `tasks:read`; POST/PATCH/DELETE require `tasks:write`. `/health` is not protected.

**Error responses:** 400 (validation; `error.message` + `error.details`), 404 (task not found), 500 (server error). See [API-DOCUMENTATION.md](API-DOCUMENTATION.md) for full request/response examples and error formats.

---

## Summary: clone → migrate → run

```bash
git clone https://github.com/agamdeepsingh/neoSoftAss-NodeJs
cd neoSoftAss-NodeJs
npm install
npm run db:migrate
npm run dev
```

Use the existing `.env` (with my DB creds) or edit it to use your own. For full API details and examples, see [API-DOCUMENTATION.md](API-DOCUMENTATION.md).
