# Setup Profesional (VS Code + Antigravity)

Tujuan: pengalaman editor seragam, cepat, aman, dan cocok untuk full-stack (JS/HTML/CSS/Docker/GitHub).

## 1) Theme yang sama

Standar yang tersedia tanpa extension:

- Theme: Default Dark+
- Icon theme: vs-seti

VS Code (workspace):

- Diatur di [.vscode/settings.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/settings.json)

Antigravity:

- Settings → Theme: pilih Default Dark+
- Settings → File Icon Theme: pilih Seti (vs-seti)

## 2) Font + ligatures (Fira Code + Monaspace)

Target:

- Editor code font: Fira Code (ligatures aktif)
- Terminal font: Monaspace (Neon/Argon)

Workspace sudah diset di:

- [.vscode/settings.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/settings.json)

Catatan penting:

- Font harus ter-install di OS dulu (Windows/macOS/Linux).
- Setelah install font, restart VS Code dan Antigravity.
## 3) Auto-sync lintas IDE (VS Code / Antigravity / Trae)

Target: cukup ubah 1 tempat (workspace), lalu user config IDE ikut ter-update otomatis.

Yang disinkronkan otomatis:
- Theme + icon theme
- Font editor + ligatures
- Font terminal + terminal colors
- Keybindings

Cara kerja:
- Saat workspace dibuka, task “ide: sync (on open)” akan menjalankan `npm run ide:sync`
- Untuk sinkron real-time saat file config berubah, jalankan task “ide: watch” (opsional)

Perintah:
- `npm run ide:sync` (sekali jalan)
- `npm run ide:watch` (jalan terus, optional)



VS Code:

- ESLint
- Docker
- EditorConfig
- GitLens
- TypeScript (Nightly) (opsional)

Daftar rekomendasi ada di:

- [.vscode/extensions.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/extensions.json)

Antigravity:

- Setelah marketplace disamakan ke VS Code, install extension yang sama.

## 4) Marketplace VS Code di Antigravity

Settings → Antigravity Settings → Editor:

- Marketplace Item URL: https://marketplace.visualstudio.com/items
- Marketplace Gallery URL: https://marketplace.visualstudio.com/_apis/public/gallery

Restart Antigravity.

## 5) Policy kerja agent yang aman

Rekomendasi:

- Terminal execution: Request review
- Review policy: Request review untuk perubahan besar

## 6) Rules & workflow (biar “nyambung”)

Workspace rules:

- [.agent/rules/project.md](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.agent/rules/project.md)

Workflow yang bisa dipanggil:

- plan-implement-verify: [.agent/workflows/plan-implement-verify.md](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.agent/workflows/plan-implement-verify.md)
- run-checks: [.agent/workflows/run-checks.md](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.agent/workflows/run-checks.md)

## 7) Keybindings (dibikin konsisten)

Keybindings workspace tidak bisa dipaksa 100% otomatis oleh repo (umumnya user-level), jadi repo ini menyediakan file untuk di-import:

- [.vscode/keybindings.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/keybindings.json)

VS Code:

- Buka Command Palette → “Preferences: Open Keyboard Shortcuts (JSON)”
- Copy isi file di atas ke keybindings JSON Anda

Antigravity:

- Import dari VS Code saat onboarding (atau gunakan keybindings yang sama)

## 8) Cara kerja harian (checklist)

- Jalankan `npm run dev`
- Sebelum push: jalankan `npm run lint`, `npm run typecheck`, `npm test`
- Atau jalankan VS Code task: “npm: checks”

## 9) Debugging

VS Code:

- Launch config “Node: dev server” ada di [.vscode/launch.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/launch.json)
