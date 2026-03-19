# SmartLog Workspace

Workspace ini menghubungkan VS Code + Antigravity untuk kerja proyek JS/HTML/CSS/Docker/GitHub.

Panduan setup profesional:
- [PRO_SETUP.md](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/docs/PRO_SETUP.md)

## Jalanin lokal

Prasyarat: Node.js 24+

```bash
npm install
npm run ide:sync
npm run dev
```

Buka: http://localhost:3000

## Docker

```bash
docker compose up --build
```

## Script standar

- `npm run lint`
- `npm run typecheck`
- `npm test`
