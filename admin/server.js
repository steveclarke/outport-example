require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.ADMIN_PORT;

const selfUrl = process.env.ADMIN_URL || "https://admin.example.test";
const hostname = selfUrl.replace(/^https?:\/\//, "");

const envVars = {
  ADMIN_PORT: process.env.ADMIN_PORT,
  ADMIN_URL: process.env.ADMIN_URL,
  API_URL: process.env.API_URL,
  API_HOSTNAME: process.env.API_HOSTNAME,
};

app.get("/", (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Panel — outport-example</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #1a1d23; color: #c9cdd4; display: flex; min-height: 100vh; }
    nav { width: 200px; background: #12141a; padding: 20px 0; flex-shrink: 0; border-right: 1px solid #2a2d35; }
    nav .brand { padding: 0 16px 20px; border-bottom: 1px solid #2a2d35; margin-bottom: 12px; }
    nav .brand span { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #636a76; }
    nav a { display: block; padding: 8px 16px; font-size: 0.85rem; color: #636a76; text-decoration: none; }
    nav a.active { color: #e8eaed; background: #1a1d23; border-left: 2px solid #5b8def; }
    main { flex: 1; padding: 32px 40px; }
    header { margin-bottom: 28px; }
    header h1 { font-size: 1.25rem; font-weight: 600; color: #e8eaed; }
    header p { font-size: 0.8rem; color: #636a76; margin-top: 4px; }
    header p code { background: #262930; padding: 2px 8px; border-radius: 3px; color: #8b9dc3; font-size: 0.8rem; }
    .card { background: #21242b; border: 1px solid #2a2d35; border-radius: 6px; overflow: hidden; }
    .card-header { padding: 12px 16px; border-bottom: 1px solid #2a2d35; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #636a76; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px 16px; border-bottom: 1px solid #2a2d35; font-size: 0.85rem; }
    tr:last-child td { border-bottom: none; }
    td:first-child { color: #8b9dc3; font-family: ui-monospace, 'SF Mono', monospace; font-size: 0.8rem; width: 180px; }
    td:last-child { color: #c9cdd4; font-family: ui-monospace, 'SF Mono', monospace; font-size: 0.8rem; }
  </style>
</head>
<body>
  <nav>
    <div class="brand"><span>Admin Panel</span></div>
    <a class="active" href="/">Environment</a>
    <a href="#">Services</a>
    <a href="#">Logs</a>
    <a href="#">Settings</a>
  </nav>
  <main>
    <header>
      <h1>Environment Variables</h1>
      <p>Service running at <code>${hostname}</code></p>
    </header>
    <div class="card">
      <div class="card-header">Injected by Outport</div>
      <table>
        ${Object.entries(envVars).map(([k, v]) => `<tr><td>${k}</td><td>${v || "(not set)"}</td></tr>`).join("\n        ")}
      </table>
    </div>
    <div class="card" style="margin-top: 24px;">
      <div class="card-header">API Connection</div>
      <div style="padding: 12px 16px; border-bottom: 1px solid #2a2d35; font-size: 0.8rem; color: #636a76;">Fetched from the API via browser</div>
      <div style="padding: 16px;">
        <pre id="api-response" style="background: #2a2d35; border-radius: 4px; padding: 12px 16px; font-family: ui-monospace, 'SF Mono', monospace; font-size: 0.8rem; color: #c9cdd4; white-space: pre-wrap; word-break: break-all; margin: 0;">Loading...</pre>
      </div>
    </div>
  </main>
  <script>
    fetch("${process.env.API_HOSTNAME}/")
      .then(r => r.json())
      .then(data => {
        document.getElementById("api-response").textContent = JSON.stringify(data, null, 2);
      })
      .catch(err => {
        document.getElementById("api-response").textContent = "Error: " + err.message;
      });
  </script>
</body>
</html>`);
});

app.listen(port, () => {
  console.log(`Admin frontend listening on port ${port}`);
});
