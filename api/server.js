require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.API_PORT;
const selfUrl = process.env.API_SELF_URL || "https://api.example.test";
const hostname = selfUrl.replace(/^https?:\/\//, "");

const envVars = {
  API_PORT: process.env.API_PORT,
  API_SELF_URL: process.env.API_SELF_URL,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = (process.env.CORS_ORIGINS || "").split(",");
  if (allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  next();
});

const jsonResponse = { service: "api", hostname, port, env: envVars };

function renderHTML() {
  const origins = (envVars.CORS_ORIGINS || "").split(",").filter(Boolean);
  const json = JSON.stringify(jsonResponse, null, 2);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${hostname}</title>
<style>
  * { margin: 0; box-sizing: border-box; }
  body { font-family: -apple-system, 'Inter', system-ui, sans-serif; background: #f4f6f9;
         color: #1a2233; padding: 3rem 1.5rem; line-height: 1.6; }
  .wrap { max-width: 540px; margin: 0 auto; }
  h1 { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 1.5rem; font-weight: 600;
       color: #0f172a; letter-spacing: -0.02em; }
  .status { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.8rem;
            font-weight: 600; color: #16a34a; margin-top: 0.25rem; text-transform: uppercase;
            letter-spacing: 0.06em; }
  .dot { width: 7px; height: 7px; background: #16a34a; border-radius: 50%; }
  hr { border: none; border-top: 1px solid #d5dbe5; margin: 1.5rem 0; }
  .section-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
                   letter-spacing: 0.08em; color: #64748b; margin-bottom: 0.5rem; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: 0.3rem 1rem; }
  dt { font-size: 0.8rem; color: #64748b; font-family: 'SF Mono', 'Fira Code', monospace; }
  dd { font-size: 0.8rem; font-family: 'SF Mono', 'Fira Code', monospace; color: #1e3a5f; }
  .origins { display: flex; flex-direction: column; gap: 0.15rem; }
  pre { background: #1e293b; color: #e2e8f0; padding: 1rem 1.25rem; border-radius: 6px;
        font-size: 0.78rem; line-height: 1.5; overflow-x: auto;
        font-family: 'SF Mono', 'Fira Code', monospace; }
  .muted { font-size: 0.75rem; color: #94a3b8; margin-top: 1.5rem; }
  .muted code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.72rem; }
</style>
</head>
<body>
<div class="wrap">
  <h1>${hostname}</h1>
  <div class="status"><span class="dot"></span> Healthy</div>
  <hr>
  <div class="section-label">Environment</div>
  <dl>
    <dt>API_PORT</dt><dd>${envVars.API_PORT || "—"}</dd>
    <dt>API_SELF_URL</dt><dd>${envVars.API_SELF_URL || "—"}</dd>
    <dt>CORS_ORIGINS</dt>
    <dd><div class="origins">${origins.map((o) => `<span>${o}</span>`).join("")}</div></dd>
  </dl>
  <hr>
  <div class="section-label">JSON Response <code class="muted">GET /</code></div>
  <pre>${json}</pre>
  <p class="muted">Request with <code>Accept: application/json</code> or <code>curl</code> to get raw JSON.</p>
</div>
</body>
</html>`;
}

app.get("/", (req, res) => {
  const accept = req.headers.accept || "";
  if (accept.includes("text/html") && !accept.includes("application/json")) {
    return res.type("html").send(renderHTML());
  }
  res.json(jsonResponse);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
