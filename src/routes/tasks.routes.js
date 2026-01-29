// src/routes/tasks.routes.js
const express = require("express");
const { z } = require("zod");
const { requireAuth } = require("../middleware/auth");
const {
  listTasksByUser,
  createTask,
  updateTask,
  deleteTask,
} = require("../db/queries/tasks");

const router = express.Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  const status = req.query.status;
  const tasks = listTasksByUser(req.session.userId, { status });
  res.json({ tasks });
});

router.post("/", (req, res) => {
  const schema = z.object({
    title: z.string().trim().min(1).max(200),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const task = createTask({ userId: req.session.userId, title: parsed.data.title });
  res.status(201).json({ task });
});

router.patch("/:id", (req, res) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ error: "Invalid task id" });
  }

  const schema = z.object({
    title: z.string().trim().min(1).max(200).optional(),
    status: z.enum(["active", "completed", "archived"]).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const updated = updateTask({
    userId: req.session.userId,
    taskId,
    title: parsed.data.title,
    status: parsed.data.status,
  });

  if (!updated) return res.status(404).json({ error: "Task not found" });

  res.json({ task: updated });
});

router.delete("/:id", (req, res) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ error: "Invalid task id" });
  }

  const ok = deleteTask({ userId: req.session.userId, taskId });
  if (!ok) return res.status(404).json({ error: "Task not found" });

  res.status(204).end();
});

module.exports = { tasksRouter: router };
