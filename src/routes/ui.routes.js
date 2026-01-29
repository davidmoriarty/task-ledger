// src/routes/ui.routes.js
const express = require("express");
const bcrypt = require("bcrypt");
const { requireAuth } = require("../middleware/auth");
const { findUserById, findUserByEmail } = require("../db/queries/users");
const {
  listTasksByUser,
  createTask,
  updateTask,
  deleteTask,
} = require("../db/queries/tasks");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login", { error: null });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = findUserByEmail(email);
  if (!user) return res.status(401).render("auth/login", { error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).render("auth/login", { error: "Invalid credentials" });

  req.session.userId = user.id;
  return res.redirect("/ui/dashboard");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("taskledger.sid");
    res.redirect("/ui/login");
  });
});

router.get("/dashboard", requireAuth, (req, res) => {
  const user = findUserById(req.session.userId);
  const tasks = listTasksByUser(req.session.userId);

  res.render("dashboard/index", { user, tasks });
});

router.post("/tasks", requireAuth, (req, res) => {
  const title = String(req.body.title || "").trim();
  if (!title) return res.redirect("/ui/dashboard");
  createTask({ userId: req.session.userId, title });
  res.redirect("/ui/dashboard");
});

router.post("/tasks/:id/toggle", requireAuth, (req, res) => {
  const taskId = Number(req.params.id);
  const tasks = listTasksByUser(req.session.userId);
  const t = tasks.find((x) => x.id === taskId);
  if (!t) return res.redirect("/ui/dashboard");

  const nextStatus = t.status === "completed" ? "active" : "completed";
  updateTask({ userId: req.session.userId, taskId, status: nextStatus });

  res.redirect("/ui/dashboard");
});

router.post("/tasks/:id/delete", requireAuth, (req, res) => {
  const taskId = Number(req.params.id);
  deleteTask({ userId: req.session.userId, taskId });
  res.redirect("/ui/dashboard");
});

module.exports = { uiRouter: router };
