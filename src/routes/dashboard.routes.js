// src/routes/dashboard.routes.js
const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  res.json({ ok: true, userId: req.session.userId });
});

module.exports = { dashboardRouter: router };
