import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const workspaceRoot = path.resolve(process.cwd());
const watchFiles = [
  path.join(workspaceRoot, ".vscode", "settings.json"),
  path.join(workspaceRoot, ".vscode", "keybindings.json")
];

function runSync() {
  const child = spawn(process.execPath, [path.join(workspaceRoot, "scripts", "ide-sync.mjs")], {
    stdio: "inherit"
  });
  child.on("exit", (code) => {
    if (code !== 0) process.stderr.write(`ide-sync exited with ${code}\n`);
  });
}

function debounce(fn, delayMs) {
  let timer = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(), delayMs);
  };
}

const debouncedSync = debounce(runSync, 400);

process.stdout.write("IDE watch: syncing on settings/keybindings changes\n");
runSync();

for (const filePath of watchFiles) {
  try {
    fs.watch(filePath, { persistent: true }, () => debouncedSync());
  } catch (e) {
    process.stderr.write(`Failed to watch ${filePath}: ${e?.message ?? e}\n`);
  }
}

process.on("SIGINT", () => process.exit(0));

