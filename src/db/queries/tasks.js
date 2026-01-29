// src/db/queries/tasks.js
const { getDb } = require("..");

function listTasksByUser(userId, { status } = {}) {
  const db = getDb();

  if (status) {
    return db
      .prepare("SELECT id, title, status, created_at AS createdAt, updated_at AS updatedAt FROM tasks WHERE user_id = ? AND status = ? ORDER BY id DESC")
      .all(userId, status);
  }

  return db
    .prepare("SELECT id, title, status, created_at AS createdAt, updated_at AS updatedAt FROM tasks WHERE user_id = ? ORDER BY id DESC")
    .all(userId);
}

function createTask({ userId, title }) {
  const db = getDb();
  const info = db
    .prepare("INSERT INTO tasks (user_id, title) VALUES (?, ?)")
    .run(userId, title);

  return db
    .prepare("SELECT id, title, status, created_at AS createdAt, updated_at AS updatedAt FROM tasks WHERE id = ?")
    .get(info.lastInsertRowid);
}

function updateTask({ userId, taskId, title, status }) {
  const db = getDb();

  const info = db
    .prepare(
      `UPDATE tasks
       SET title = COALESCE(?, title),
           status = COALESCE(?, status),
           updated_at = datetime('now')
       WHERE id = ? AND user_id = ?`
    )
    .run(title ?? null, status ?? null, taskId, userId);

  if (info.changes === 0) return null;

  return db
    .prepare(
      "SELECT id, title, status, created_at AS createdAt, updated_at AS updatedAt FROM tasks WHERE id = ? AND user_id = ?"
    )
    .get(taskId, userId);
}

function deleteTask({ userId, taskId }) {
  const db = getDb();
  const info = db
    .prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?")
    .run(taskId, userId);

  return info.changes > 0;
}

module.exports = { listTasksByUser, createTask, updateTask, deleteTask };
