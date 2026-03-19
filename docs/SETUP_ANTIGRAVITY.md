# Setup Antigravity (biar nyambung dengan VS Code)

Panduan lengkap (theme, font, ligatures, terminal colors, keybindings):

- [PRO_SETUP.md](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/docs/PRO_SETUP.md)

## 1) Import setting VS Code

Saat onboarding Antigravity, pilih import dari VS Code untuk:

- keybindings
- theme
- settings editor

Setelah workspace ini dibuka, sinkron otomatis akan jalan via task “ide: sync (on open)”.

## 2) Samakan Extension Marketplace dengan VS Code

Di Antigravity: Settings → Antigravity Settings → Editor, set:

- Marketplace Item URL: https://marketplace.visualstudio.com/items
- Marketplace Gallery URL: https://marketplace.visualstudio.com/_apis/public/gallery

Referensi: https://jimmysong.io/blog/antigravity-vscode-style-ide/

Restart Antigravity setelah mengubahnya.

## 3) Theme + font dari workspace

Saat Antigravity membuka folder workspace ini, ia akan membaca:

- [.vscode/settings.json](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.vscode/settings.json)

File tersebut sudah menyetel:

- Theme Default Dark+ + icon vs-seti
- Font editor Fira Code (ligatures)
- Font terminal Monaspace (Neon/Argon)
- Terminal color palette

## 4) Rules & Workflows per-workspace (yang bikin “enak dipakai bareng”)

Antigravity mendukung rules/workflow untuk workspace. Repo ini menyediakan:

- Workspace rules: [.agent/rules/project.md](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.agent/rules/project.md)
- Workspace workflows: folder [.agent/workflows](file:///c:/Users/HP/Documents/trae_projects/smartlog-wms/.agent/workflows)

Referensi struktur rules/workflow: https://atamel.dev/posts/2025/11-25_customize_antigravity_rules_workflows/

## 5) Policy yang aman dan stabil

Rekomendasi:

- Terminal execution: Request review
- Review policy: Request review untuk perubahan besar

Tujuan: agent tetap cepat, tapi aksi berisiko (hapus file, run command besar) selalu bisa Anda cek dulu.
