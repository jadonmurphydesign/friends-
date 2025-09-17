# Friends App

Next.js frontend + ASP.NET Core Web API backend + PostgreSQL (running in Podman). This README gets you from zero to “data on screen” fast.

---

## Stack

* **Frontend:** Next.js (App Router), Tailwind, Headless UI, Formik + Yup
* **Backend:** .NET 8, ASP.NET Core Web API, EF Core
* **Database:** PostgreSQL 16 in Podman

---

## Prerequisites

* Node.js 18+ and a package manager (npm / pnpm / yarn)
* .NET 8 SDK
* Podman (or Docker)

> If you’re on Windows with WSL, run all commands inside your Linux distro shell.

---

## Project Structure (simplified)

```
friends/
├─ backend/
│  ├─ FriendsApi.csproj
│  ├─ Program.cs
│  ├─ appsettings.json
│  ├─ Controllers/
│  │  └─ FriendsController.cs
│  ├─ Data/
│  │  └─ AppDbContext.cs
│  ├─ Models/
│  │  ├─ Friend.cs
│  │  └─ CreateFriendDto.cs
│  └─ Repositories/
│     ├─ IFriendsRepository.cs
│     └─ FriendsRepository.cs
└─ frontend/
   ├─ app/
   │  └─ friends/
   │     └─ page.tsx
   ├─ components/
   │  ├─ Modal.tsx
   │  ├─ FormikInput.tsx
   │  └─ AddFriendModal.tsx
   ├─ services/
   │  └─ friends.ts
   ├─ types/
   │  └─ friends.ts
   └─ .env.local
```

---

> **Mac users:** If you run
 `chmod +x setup.sh` &&
 `setup.sh`
 
 script from the project root to automate the database and backend setup. This will handle container management, connection strings, package installation, migrations, and running the backend. You can skip the manual steps 1 and  2.a-g below if you use the script.

## 1) Database: PostgreSQL via Podman

Create and run a Postgres container (with a named volume for persistence):

```bash
podman volume create friends_data
podman run -d \
  --name friends-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=friends \
  -p 5432:5432 \
  -v friends_data:/var/lib/postgresql/data \
  docker.io/library/postgres:16
```

Verify:

```bash
podman ps
podman logs --tail=50 friends-pg
podman exec -it friends-pg psql -U postgres -d friends -c "SELECT version();"
```

> If Podman complains about short image names, always use the fully qualified name `docker.io/library/postgres:16`.

---

## 2) Backend Setup


From `friends/backend`:

### a) Configure connection string

`appsettings.json` (and `appsettings.Development.json` if present):

```json
{
  "ConnectionStrings": {
    "Default": "Host=127.0.0.1;Port=5432;Database=friends;Username=postgres;Password=secret"
  }
}
```

### b) Ensure required packages

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

### g) Create schema and run

```bash
# from friends/backend
dotnet ef migrations add Initial
dotnet ef database update

# run the API
dotnet run
```

Test:

```bash
# Replace port with the HTTP port printed by dotnet run
curl http://localhost:5271/api/friends
curl -X POST http://localhost:5271/api/friends \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Sam Lee","age":28,"city":"Austin","favoriteColor":"Orange","bio":"Climber"}'
```

---

## 3) Frontend Setup

From `friends/frontend`:

### a) Env var

Create `.env.local` with your backend base URL:

```
NEXT_PUBLIC_API_BASE=http://localhost:5271

```

### d) Run the frontend

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/friends`.

---

## API Reference

* **GET** `/api/friends` → `Friend[]`
* **GET** `/api/friends/{id}` → `Friend`
* **POST** `/api/friends`

  ```json
  {
    "fullName": "Alex Johnson",
    "age": 29,
    "city": "Seattle",
    "favoriteColor": "Blue",
    "bio": "Coffee nerd & hiker"
  }
  ```

**Friend** response shape:

```json
{
  "id": "e.g. 7f0a...",
  "fullName": "...",
  "age": 29,
  "city": "...",
  "favoriteColor": "...",
  "bio": "..."
}
```

## Notes

* The backend generates `Id` server-side; clients should not send it.
* Keep auto-migration in `Program.cs` only for development.
* To switch to Docker, replace `podman` with `docker`—the commands are the same.

---
