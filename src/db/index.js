// src/db/index.js
const path = require("node:path");
const Database = require("better-sqlite3");

function getDbPath() {
  // Keep default location in-repo for easy local dev.
  // You can override with DB_PATH=.data/taskledger.db
  return process.env.DB_PATH
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.resolve(process.cwd(), ".data/taskledger.db");
}

let db;

/**
 * Returns a singleton DB connection.
 */
function getDb() {
  if (!db) {
    db = new Database(getDbPath());
    db.pragma("foreign_keys = ON");
  }
  return db;
}

module.exports = { getDb };
