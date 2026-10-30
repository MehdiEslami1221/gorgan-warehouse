# Development and packaging

## Environment

Use Node.js 24.16+ within the 24.x series. SQLite is provided by Node itself. Dependency versions are pinned in package-lock.json.

```bash
npm ci
npm run dev
npm test
npm run build
```

The interface remains Persian and RTL; these repository documents are English.

## Standalone production startup

Next.js creates `.next/standalone/server.js`. Copy `public` to `.next/standalone/public` and `.next/static` to `.next/standalone/.next/static` before running it. Static assets are required for a complete deployment.

Example in PowerShell after building:

```powershell
Copy-Item public .next/standalone/public -Recurse -Force
Copy-Item .next/static .next/standalone/.next/static -Recurse -Force
$env:HOSTNAME = "127.0.0.1"
$env:PORT = "3322"
$env:WAREHOUSE_DATA = Join-Path $PWD "data"
node .next/standalone/server.js
```

`WAREHOUSE_DATA` selects the persistent database directory. Without it, data is stored under the process working directory. Set it explicitly when launching standalone output.

## Build a Windows distribution

Build on Windows x64 so the traced native dependencies match the target platform. Obtain Node.js 24.x from its official distributor and retain the accompanying license when redistributing it.

```powershell
npm ci
npm test
npm run build
$env:WINDOWS_NODE = "C:\path\to\node.exe"
node scripts/package.mjs
```

The package is written to `release/gorgan-warehouse`. It includes the standalone app, local assets, Node runtime, launcher, stop/restore utilities and complete source. `START.bat` and `START.cmd` wait for readiness and then open the default browser. PowerShell Start-Process is attempted first; the Windows start command is the fallback.

Cross-building on Linux requires separately supplying compatible Windows native dependencies; copying a Linux-only dependency bundle is not a validated Windows build procedure.

## Source-only repository

Do not commit node_modules, .next, app-runtime, runtime, release, databases, backups, environment secrets or ZIP distributions. Ignore rules cover those paths. The public package intentionally excludes the supplied IRANSansX binaries; see public/fonts/README.md.

No live municipal data belongs in examples or tests. Existing tests use generated temporary records and temporary database directories.
