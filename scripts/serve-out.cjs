// Serves the static export in out/ the way Apache does on Hostinger:
// /path/ -> /path/index.html, /path -> 301 /path/, unknown -> 404.html,
// gzip for text (mod_deflate) and long-lived caching for hashed assets
// (mod_expires) — so local Lighthouse numbers match production.
//   node scripts/serve-out.cjs   (port 3400)
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const ROOT = path.join(__dirname, "..", "out");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".ico": "image/x-icon" };

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(ROOT, url);
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!url.endsWith("/")) return res.writeHead(301, { Location: url + "/" + (req.url.includes("?") ? "?" + req.url.split("?")[1] : "") }).end();
      file = path.join(file, "index.html");
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      return fs.createReadStream(path.join(ROOT, "404.html")).pipe(res);
    }
    const ext = path.extname(file);
    const headers = { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": url.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : "no-cache" };
    if ([".html", ".js", ".css", ".svg", ".json", ".txt"].includes(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] || "")) {
      res.writeHead(200, { ...headers, "Content-Encoding": "gzip", Vary: "Accept-Encoding" });
      return fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res);
    }
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  })
  .listen(3400, () => console.log("serving out/ on http://localhost:3400"));
