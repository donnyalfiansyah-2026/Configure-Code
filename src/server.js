import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "../public");

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

function safeResolvePublicPath(urlPath) {
  const normalized = urlPath.split("?")[0].split("#")[0];
  const decoded = decodeURIComponent(normalized);
  const joined = path.join(publicDir, decoded);
  const resolved = path.resolve(joined);
  if (!resolved.startsWith(path.resolve(publicDir))) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.statusCode = 400;
    res.end("Bad Request");
    return;
  }

  if (req.url.startsWith("/api/health")) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  const urlPath = req.url === "/" ? "/index.html" : req.url;
  const filePath = safeResolvePublicPath(urlPath);
  if (!filePath) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        const fallback = path.join(publicDir, "index.html");
        fs.readFile(fallback, (fallbackErr, fallbackData) => {
          if (fallbackErr) {
            res.statusCode = 404;
            res.end("Not Found");
            return;
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(fallbackData);
        });
        return;
      }
      res.statusCode = 500;
      res.end("Internal Server Error");
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType(filePath));
    res.end(data);
  });
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => {
  process.stdout.write(`SmartLog workspace server: http://localhost:${port}\n`);
});

