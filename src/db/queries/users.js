// src/db/queries/users.js
const { getDb } = require("..");

function findUserByEmail(email) {
  const db = getDb();
  return db
    .prepare("SELECT id, email, password_hash AS passwordHash FROM users WHERE email = ?")
    .get(email);
}

function findUserById(id) {
  const db = getDb();
  return db
    .prepare("SELECT id, email FROM users WHERE id = ?")
    .get(id);
}

function createUser({ email, passwordHash }) {
  const db = getDb();
  const info = db
    .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
    .run(email, passwordHash);

  return { id: info.lastInsertRowid, email };
}

module.exports = { findUserByEmail, findUserById, createUser };
