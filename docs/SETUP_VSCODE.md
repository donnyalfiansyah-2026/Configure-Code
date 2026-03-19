# Setup VS Code (SmartLog Workspace)

Panduan lengkap (theme, font, ligatures, terminal colors, keybindings):
- [PRO_SETUP.md](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/docs/PRO_SETUP.md)

## 1) Install extension yang direkomendasikan

Di VS Code: Extensions → install:

- ESLint
- Docker
- EditorConfig
- GitLens (opsional)

Repo ini sudah menambahkan rekomendasi extension di:
- [.vscode/extensions.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/extensions.json)

## 2) Pakai workspace settings

Repo ini menambahkan:
- [.vscode/settings.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/settings.json)
- [.vscode/tasks.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/tasks.json)
- [.vscode/launch.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/launch.json)

Keybindings untuk di-import:
- [.vscode/keybindings.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/keybindings.json)

## 3) Workflow kerja (cepat)

- Jalankan task: “npm: install”
- Jalankan task: “ide: sync (on open)” (otomatis saat folder dibuka)
- Jalankan task: “npm: dev”
- Saat sebelum push: “npm: lint”, “npm: typecheck”, “npm: test”
