// src/lib/ensureDataDir.js
const fs = require("node:fs");
const path = require("node:path");

function ensureDataDir() {
  const dataDir = path.resolve(process.cwd(), ".data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(path.join(dataDir, "sessions"), { recursive: true });
  return dataDir;
}

module.exports = { ensureDataDir };
