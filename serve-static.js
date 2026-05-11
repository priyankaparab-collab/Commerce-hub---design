const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3845;
const ROOT = path.join(__dirname, "out");
const BASE = "/Commerce-hub---design";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".txt":  "text/plain",
};

function resolvePath(urlPath) {
  // Strip basePath prefix for asset/page requests
  let stripped = urlPath;
  if (stripped.startsWith(BASE + "/")) {
    stripped = stripped.slice(BASE.length);
  } else if (stripped === BASE) {
    stripped = "/";
  }

  // Remove trailing slash for file lookup (except root)
  if (stripped !== "/" && stripped.endsWith("/")) stripped = stripped.slice(0, -1);

  const filePath = path.join(ROOT, stripped);

  // Candidates: exact, .html extension, index.html in directory
  const candidates = [filePath, filePath + ".html", path.join(filePath, "index.html")];
  for (const c of candidates) {
    try { if (fs.statSync(c).isFile()) return c; } catch (_) {}
  }
  return null;
}

http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  const resolved = resolvePath(urlPath);

  if (!resolved) {
    // Try 404.html
    const notFound = path.join(ROOT, "404.html");
    try {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(notFound).pipe(res);
    } catch (_) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    }
    return;
  }

  const ext = path.extname(resolved);
  const mime = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": mime });
  fs.createReadStream(resolved).pipe(res);
}).listen(PORT, "127.0.0.1", () => {
  process.stdout.write("Listening on http://localhost:" + PORT + "\n");
});
