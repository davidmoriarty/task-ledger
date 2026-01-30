// src/lib/ensureDataDir.js
const fs = require("node:fs");
const path = require("node:path");

function ensureDataDir() {
  // Fly volume mount (preferred)
  const flyDataDir = "/data";

  const dataDir = fs.existsSync(flyDataDir)
    ? flyDataDir
    : path.resolve(process.cwd(), ".data");

  fs.mkdirSync(dataDir, { recursive: true });
  return dataDir;
}

module.exports = { ensureDataDir };
