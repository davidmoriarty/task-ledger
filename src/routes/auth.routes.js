// src/routes/auth.routes.js
const express = require('express');
const bcrypt = require('bcrypt');

const { findUserByEmail, createUser } = require('../db/queries/users');

const router = express.Router();

/**
 * POST /auth/register
 */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = createUser({ email, passwordHash });

  req.session.userId = user.id;

  res.status(201).json({ ok: true });
});

/**
 * POST /auth/login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.session.userId = user.id;

  res.json({ ok: true });
});

// POST /auth/demo
router.post("/demo", async (req, res) => {
  try {
    const demoEmail = process.env.DEMO_EMAIL || "demo@taskledger.local";
    const demoPassword = process.env.DEMO_PASSWORD || "demo_password_change_me";

    let user = findUserByEmail(demoEmail);

    if (!user) {
      const passwordHash = await bcrypt.hash(demoPassword, 12);
      user = createUser({ email: demoEmail, passwordHash });
    }

    res.req.session.userId = user.id;

    // Ensure session is persisted before redirect
    return req.session.save(() => res.redirect("/ui/dashboard"));
  } catch {
    return res.status(500).render("auth/login", {
      error: "Demo login is temporarily unavailable.",
    });
  }
});

/**
 * POST /auth/logout
 */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("taskledger.sid");
    res.json({ ok: true });
  });
});

module.exports = { authRouter: router };
