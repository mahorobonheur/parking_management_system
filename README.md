# Parking management system

Full-stack demo for managing parking lots, spaces, reservations, live occupancy, and staff/driver workflows. The API is an ASP.NET Core app with JWT authentication, Entity Framework Core, and SQL Server. Two frontends are included: a **React (Vite)** app under `frontend/` and a **TypeScript** client under `client/`.

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (project targets **.NET 10**)
- [SQL Server](https://www.microsoft.com/sql-server) or **SQL Server LocalDB** (default connection string uses LocalDB)
- [Node.js](https://nodejs.org/) **20+** (for the Vite frontends)

## Quick start (API)

1. Clone the repository and open a terminal in the solution folder (where `ParkingManagementSystem.csproj` lives).

2. Adjust the connection string in `appsettings.json` (or override with user secrets / environment variables) if you are not using LocalDB:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ParkingManagementSystem;Trusted_Connection=True;MultipleActiveResultSets=true"
   }
   ```

3. Run the API (migrations and seed data run on startup):

   ```bash
   dotnet run
   ```

   Default URLs from `Properties/launchSettings.json`:

   - HTTP: `http://localhost:5000`
   - HTTPS: `https://localhost:7254`

4. Open the root URL or call the API directly, for example: `GET http://localhost:5000/api/Availability/live`

### Seeded accounts

Created on first run by `Program.cs` / `SeedData` (change in `Program.cs` if you need different emails):

| Role        | Email                 | Password    |
|------------|------------------------|-------------|
| Admin      | `admin@parking.local`  | `Admin@123` |
| Attendant  | `manager@parking.local` | `Manager@123` |

Register new users via `POST /api/Auth/register`; they are assigned the **Driver** role and the default organization.

## JWT configuration

`appsettings.json` includes a `Jwt` section (`Issuer`, `Audience`, `Secret`, token lifetimes). For anything beyond local development, **replace the secret** with a long random value (for example via [user secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) or environment variables), and use HTTPS in production.

## Frontends

### `frontend/` (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Dev server defaults to **port 5173** and proxies `/api` and `/hubs` to `http://localhost:5000` unless you set `VITE_API_PROXY_TARGET`. You can point the UI at the API with `VITE_API_URL` in `.env.development` (see comments in `vite.config.js`).

### `client/` (React + TypeScript + Vite)

```bash
cd client
npm install
npm run dev
```

Uses port **5173** by default; see `client/vite.config.ts` for proxy settings. Copy `client/.env.example` if you add environment-based API URLs.

The API’s CORS policy allows common Vite origins on ports **5173** and **5174** (`Program.cs`).

## Useful commands

```bash
# Build
dotnet build

# Add a new EF Core migration (after model changes)
dotnet ef migrations add <MigrationName>

# Tool manifest (local dotnet-ef)
dotnet tool restore
```

## Project layout

| Path | Purpose |
|------|---------|
| `Controllers/` | REST API |
| `Data/` | `ApplicationDbContext`, migrations, seeding, bootstrap |
| `Models/` | Entities, DTOs, permissions |
| `Services/` | JWT, audit, webhooks, SignalR broadcast |
| `Hubs/` | Real-time parking events |
| `Migrations/` | EF Core SQL Server migrations |
| `frontend/` | Primary React dashboard (JSX) |
| `client/` | Alternate React + TypeScript UI |

## License

No license file is included in this repository; add one if you intend to distribute or open-source the project.
