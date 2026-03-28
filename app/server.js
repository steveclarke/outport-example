require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.APP_PORT;

const selfUrl = process.env.APP_URL || "https://example.test";
const hostname = selfUrl.replace(/^https?:\/\//, "");

const envVars = {
  APP_PORT: process.env.APP_PORT,
  APP_URL: process.env.APP_URL,
  API_URL: process.env.API_URL,
  API_HOSTNAME: process.env.API_HOSTNAME,
};

app.get("/", (_req, res) => {
  const rows = Object.entries(envVars)
    .map(([k, v]) => `<tr><td>${k}</td><td>${v || "(not set)"}</td></tr>`)
    .join("\n            ");

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Example App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #faf8f5; color: #2d2d2d; }
    .hero { padding: 80px 24px 60px; text-align: center; background: linear-gradient(135deg, #f7f3ee 0%, #faf8f5 100%); }
    .hero h1 { font-size: 2.8rem; font-weight: 700; color: #1a1a1a; letter-spacing: -0.03em; margin-bottom: 12px; }
    .hero .tagline { font-size: 1.15rem; color: #6b6560; max-width: 440px; margin: 0 auto 28px; line-height: 1.6; }
    .badge { display: inline-block; background: #e8f4f0; color: #1a7a5a; font-size: 0.85rem; font-weight: 600; padding: 6px 16px; border-radius: 20px; letter-spacing: 0.02em; }
    .hostname { display: inline-block; margin-top: 20px; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 1.05rem; color: #2E86AB; font-weight: 500; }
    .card { max-width: 560px; margin: -20px auto 60px; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04); overflow: hidden; }
    .card-header { padding: 18px 24px; border-bottom: 1px solid #f0ebe4; }
    .card-header h2 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: #9b9490; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; }
    tr:not(:last-child) td { border-bottom: 1px solid #f5f0e8; }
    td { padding: 14px 24px; font-size: 0.9rem; }
    td:first-child { color: #8a8480; font-weight: 500; width: 40%; }
    td:last-child { font-family: 'SF Mono', 'Fira Code', monospace; color: #1a1a1a; font-size: 0.85rem; }
    .api-card { max-width: 560px; margin: 0 auto 60px; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04); overflow: hidden; }
    .api-card .card-header { padding: 18px 24px; border-bottom: 1px solid #f0ebe4; }
    .api-card .card-header h2 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: #9b9490; font-weight: 600; }
    .api-card .subtitle { padding: 12px 24px 0; font-size: 0.85rem; color: #8a8480; }
    .api-card pre { margin: 12px 24px 24px; background: #1e293b; color: #e2e8f0; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.85rem; padding: 16px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
  </style>
</head>
<body>
  <div class="hero">
    <span class="badge">Live Environment</span>
    <h1>Welcome to Example App</h1>
    <p class="tagline">A modern workspace for your team. Manage projects, track progress, and ship faster — all in one place.</p>
    <div class="hostname">${hostname}</div>
  </div>
  <div class="card">
    <div class="card-header"><h2>Service Configuration</h2></div>
    <table>
      ${rows}
    </table>
  </div>
  <div class="api-card">
    <div class="card-header"><h2>Live API Response</h2></div>
    <p class="subtitle">Fetched from ${process.env.API_HOSTNAME} via browser</p>
    <pre id="api-response">Loading...</pre>
  </div>
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
  console.log(`App frontend listening on port ${port}`);
});
