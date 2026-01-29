// scripts/init-db.js
const fs = require('node:fs');
const path = require('node:path');
const Database = require("better-sqlite3");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const dataDir = path.join(projectRoot, ".data");
  const dbPath = process.env.DB_PATH
    ? path.resolve(projectRoot, process.env.DB_PATH)
    : path.join(dataDir, "taskledger.db");

  ensureDir(path.dirname(dbPath));

  const schemaPath = path.join(projectRoot, "src", "db", "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  const db = new Database(dbPath);
  try {
    db.exec(schemaSql);
    console.log(`✅ Database initialized at: ${dbPath}`);
  } finally {
    db.close();
  }
}

main();
