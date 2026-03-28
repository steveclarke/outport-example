require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.DOCS_PORT;
const selfUrl = process.env.DOCS_URL || "https://docs.example.test";
const hostname = selfUrl.replace(/^https?:\/\//, "");

app.get("/", (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Documentation — outport-example</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; background: #fff; }
    header { background: #0f172a; color: #fff; padding: 14px 24px; font-size: 15px; font-weight: 600; letter-spacing: 0.02em; display: flex; justify-content: space-between; align-items: center; }
    header span { opacity: 0.5; font-weight: 400; font-size: 13px; }
    .layout { max-width: 720px; margin: 0 auto; padding: 48px 24px 64px; }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; color: #0f172a; }
    .subtitle { color: #64748b; font-size: 15px; margin-bottom: 40px; }
    h2 { font-size: 18px; font-weight: 600; margin: 36px 0 12px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    p { line-height: 1.7; color: #475569; margin-bottom: 16px; font-size: 15px; }
    .step { display: flex; gap: 14px; margin-bottom: 20px; }
    .step-num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: #e0f2fe; color: #0369a1; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
    .step-body { line-height: 1.7; color: #475569; font-size: 15px; }
    .step-body code { background: #f1f5f9; padding: 2px 7px; border-radius: 4px; font-size: 13px; font-family: 'SF Mono', 'Fira Code', monospace; color: #0f172a; }
    .env-aside { margin-top: 48px; padding: 16px 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #64748b; }
    .env-aside strong { color: #475569; font-weight: 600; }
    .env-aside code { font-family: 'SF Mono', 'Fira Code', monospace; background: #e2e8f0; padding: 1px 5px; border-radius: 3px; font-size: 12px; color: #334155; }
  </style>
</head>
<body>
  <header>Docs <span>${hostname}</span></header>
  <div class="layout">
    <h1>Getting Started</h1>
    <p class="subtitle">Everything you need to set up and run the example project.</p>

    <h2>Installation</h2>
    <div class="step">
      <div class="step-num">1</div>
      <div class="step-body">Clone the repository and install dependencies with <code>npm install</code> in each service directory.</div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-body">Run <code>outport up</code> from the project root. Outport allocates deterministic ports and writes <code>.env</code> files for each service.</div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-body">Start each service with <code>npm start</code>. Each service is available at its <code>.test</code> hostname — check <code>outport status</code> to see the URLs assigned to your instance.</div>
    </div>

    <h2>How It Works</h2>
    <p>Each service declares its port requirements in <code>outport.yml</code>. Outport hashes the project, instance, and service name to produce a stable port, then writes it into the service's <code>.env</code> file so no manual configuration is needed.</p>
    <p>The local proxy maps <code>.test</code> hostnames to the correct port, giving each service a clean URL with automatic TLS.</p>

    <div class="env-aside">
      <strong>Environment</strong> &mdash;
      DOCS_PORT: <code>${process.env.DOCS_PORT || "(not set)"}</code> &bull;
      DOCS_URL: <code>${process.env.DOCS_URL || "(not set)"}</code>
    </div>
  </div>
</body>
</html>`);
});

app.listen(port, () => {
  console.log(`Docs server listening on port ${port}`);
});
