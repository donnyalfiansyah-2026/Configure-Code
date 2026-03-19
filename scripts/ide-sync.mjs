import fs from "node:fs";
import path from "node:path";
import os from "node:os";

function stripJsoncComments(raw) {
  let out = "";
  let i = 0;
  let inString = false;
  let stringQuote = null;
  let escaped = false;

  while (i < raw.length) {
    const ch = raw[i];

    if (inString) {
      out += ch;
      if (escaped) {
        escaped = false;
        i += 1;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        i += 1;
        continue;
      }
      if (ch === stringQuote) {
        inString = false;
        stringQuote = null;
      }
      i += 1;
      continue;
    }

    if (ch === `"` || ch === `'`) {
      inString = true;
      stringQuote = ch;
      out += ch;
      i += 1;
      continue;
    }

    if (ch === "/" && i + 1 < raw.length) {
      const next = raw[i + 1];
      if (next === "/") {
        i += 2;
        while (i < raw.length && raw[i] !== "\n") i += 1;
        continue;
      }
      if (next === "*") {
        i += 2;
        while (i < raw.length) {
          if (raw[i] === "*" && i + 1 < raw.length && raw[i + 1] === "/") {
            i += 2;
            break;
          }
          i += 1;
        }
        continue;
      }
    }

    out += ch;
    i += 1;
  }

  return out;
}

function stripJsonTrailingCommas(raw) {
  let out = "";
  let i = 0;
  let inString = false;
  let stringQuote = null;
  let escaped = false;

  const isWhitespace = (c) =>
    c === " " || c === "\t" || c === "\n" || c === "\r";

  while (i < raw.length) {
    const ch = raw[i];

    if (inString) {
      out += ch;
      if (escaped) {
        escaped = false;
        i += 1;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        i += 1;
        continue;
      }
      if (ch === stringQuote) {
        inString = false;
        stringQuote = null;
      }
      i += 1;
      continue;
    }

    if (ch === `"` || ch === `'`) {
      inString = true;
      stringQuote = ch;
      out += ch;
      i += 1;
      continue;
    }

    if (ch === ",") {
      let j = i + 1;
      while (j < raw.length && isWhitespace(raw[j])) j += 1;
      const nextNonWs = raw[j];
      if (nextNonWs === "}" || nextNonWs === "]") {
        i += 1;
        continue;
      }
    }

    out += ch;
    i += 1;
  }

  return out;
}

function parseJsonLenient(raw, filePath) {
  const withoutBom = raw.replace(/^\uFEFF/, "");
  try {
    return JSON.parse(withoutBom);
  } catch {
    try {
      const noComments = stripJsoncComments(withoutBom);
      const noTrailingCommas = stripJsonTrailingCommas(noComments);
      return JSON.parse(noTrailingCommas);
    } catch (e2) {
      const msg = e2?.message ?? String(e2);
      const err = new Error(`Gagal parse JSON/JSONC: ${filePath}\n${msg}`);
      err.cause = e2;
      throw err;
    }
  }
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return parseJsonLenient(raw, filePath);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function safeBackup(filePath) {
  if (!fileExists(filePath)) return;
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  const stamp = new Date().toISOString().replaceAll(":", "-");
  const backup = path.join(dir, `${base}.bak.${stamp}`);
  fs.copyFileSync(filePath, backup);
}

function mergeShallow(base, overlay) {
  return { ...(base ?? {}), ...(overlay ?? {}) };
}

function getWorkspaceRoot() {
  return path.resolve(process.cwd());
}

function getManagedSettings(workspaceRoot) {
  const workspaceSettingsPath = path.join(
    workspaceRoot,
    ".vscode",
    "settings.json",
  );
  const settings = readJson(workspaceSettingsPath);

  const allowList = [
    "workbench.colorTheme",
    "workbench.iconTheme",
    "workbench.colorCustomizations",
    "editor.fontFamily",
    "editor.fontLigatures",
    "editor.fontSize",
    "editor.fontWeight",
    "editor.lineHeight",
    "editor.letterSpacing",
    "terminal.integrated.fontFamily",
    "terminal.integrated.fontSize",
    "terminal.integrated.fontWeight",
    "terminal.integrated.smoothScrolling",
    "terminal.integrated.tabs.enabled",
    "terminal.integrated.defaultLocation",
    "terminal.integrated.defaultProfile.windows",
  ];

  const managed = {};
  for (const key of allowList) {
    if (Object.prototype.hasOwnProperty.call(settings, key))
      managed[key] = settings[key];
  }
  return managed;
}

function getManagedKeybindings(workspaceRoot) {
  const p = path.join(workspaceRoot, ".vscode", "keybindings.json");
  return fs.readFileSync(p, "utf8");
}

function getWindowsAppDataRoaming() {
  return process.env.APPDATA || null;
}

function getUserConfigTargets() {
  const targets = [];
  const platform = os.platform();

  if (platform === "win32") {
    const appData = getWindowsAppDataRoaming();
    if (!appData) return targets;

    targets.push({
      name: "VS Code",
      userDir: path.join(appData, "Code", "User"),
    });
    targets.push({
      name: "VS Code Insiders",
      userDir: path.join(appData, "Code - Insiders", "User"),
    });
    targets.push({
      name: "Antigravity",
      userDir: path.join(appData, "Antigravity", "User"),
    });
    targets.push({
      name: "Trae",
      userDir: path.join(appData, "Trae", "User"),
    });
    targets.push({
      name: "Trae (alt)",
      userDir: path.join(appData, "Trae IDE", "User"),
    });

    return targets;
  }

  const home = os.homedir();
  if (platform === "darwin") {
    targets.push({
      name: "VS Code",
      userDir: path.join(
        home,
        "Library",
        "Application Support",
        "Code",
        "User",
      ),
    });
    targets.push({
      name: "VS Code Insiders",
      userDir: path.join(
        home,
        "Library",
        "Application Support",
        "Code - Insiders",
        "User",
      ),
    });
    targets.push({
      name: "Antigravity",
      userDir: path.join(
        home,
        "Library",
        "Application Support",
        "Antigravity",
        "User",
      ),
    });
    targets.push({
      name: "Trae",
      userDir: path.join(
        home,
        "Library",
        "Application Support",
        "Trae",
        "User",
      ),
    });
    return targets;
  }

  targets.push({
    name: "VS Code",
    userDir: path.join(home, ".config", "Code", "User"),
  });
  targets.push({
    name: "VS Code Insiders",
    userDir: path.join(home, ".config", "Code - Insiders", "User"),
  });
  targets.push({
    name: "Antigravity",
    userDir: path.join(home, ".config", "Antigravity", "User"),
  });
  targets.push({
    name: "Trae",
    userDir: path.join(home, ".config", "Trae", "User"),
  });
  return targets;
}

function syncToTarget(
  { name, userDir },
  { managedSettings, managedKeybindings },
) {
  const settingsPath = path.join(userDir, "settings.json");
  const keybindingsPath = path.join(userDir, "keybindings.json");

  if (!fs.existsSync(userDir))
    return { name, userDir, status: "skipped_missing_dir" };

  const existingSettings = fileExists(settingsPath)
    ? readJson(settingsPath)
    : {};
  const merged = mergeShallow(existingSettings, managedSettings);

  safeBackup(settingsPath);
  writeJson(settingsPath, merged);

  safeBackup(keybindingsPath);
  fs.mkdirSync(path.dirname(keybindingsPath), { recursive: true });
  fs.writeFileSync(
    keybindingsPath,
    managedKeybindings.endsWith("\n")
      ? managedKeybindings
      : managedKeybindings + "\n",
    "utf8",
  );

  return { name, userDir, status: "updated" };
}

function main() {
  const workspaceRoot = getWorkspaceRoot();
  const managedSettings = getManagedSettings(workspaceRoot);
  const managedKeybindings = getManagedKeybindings(workspaceRoot);

  const targets = getUserConfigTargets();
  const results = [];
  for (const t of targets) {
    results.push(syncToTarget(t, { managedSettings, managedKeybindings }));
  }

  const updated = results.filter((r) => r.status === "updated");
  const skipped = results.filter((r) => r.status !== "updated");

  process.stdout.write(
    `IDE sync: updated=${updated.length} skipped=${skipped.length}\n`,
  );
  for (const r of results) {
    process.stdout.write(`- ${r.name}: ${r.status} (${r.userDir})\n`);
  }
}

main();
