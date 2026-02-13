// src/lib/demoLogin.js
const bcrypt = require("bcrypt");
const { findUserByEmail, createUser } = require("../db/queries/users");

async function ensureDemoUserAndSetSession(req) {
  const demoEmail = process.env.DEMO_EMAIL || "demo@taskledger.local";
  const demoPassword = process.env.DEMO_PASSWORD || "demo_password_change_me";

  let user = findUserByEmail(demoEmail);

  if (!user) {
    const passwordHash = await bcrypt.hash(demoPassword, 12);
    user = createUser({ email: demoEmail, passwordHash });
  }

  req.session.userId = user.id;

  return new Promise((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve(user)));
  });
}

module.exports = { ensureDemoUserAndSetSession };
