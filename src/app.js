// src/app.js
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { ensureDataDir } = require("./lib/ensureDataDir");
const dataDir = ensureDataDir();
const session = require("express-session");
const FileStoreFactory = require("session-file-store");

const { authRouter } = require("./routes/auth.routes");
const { dashboardRouter } = require("./routes/dashboard.routes");
const { tasksRouter } = require("./routes/tasks.routes");
const { uiRouter } = require("./routes/ui.routes");

const app = express();

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in production");
}

app.set("trust proxy", 1);

app.use(helmet());
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", "src/views");

// serve static before session
app.use(
  express.static("src/public", {
    maxAge: "30d"
  }),
);

app.use((req, res, next) => {
  if (req.accepts(["html", "json"]) === "html") {
    res.setHeader(
      "Cache-Control",
      "private, no-store, no-transform",
    );
  }

  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.locals.canonical = `${req.protocol}://${req.get("host")}${req.path}`;
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const FileStore = FileStoreFactory(session);

app.use(
  session({
    store: new FileStore({
      // absolute path
      path: `${dataDir}/sessions`,
      retries: 0,
      logFn: () => {},
    }),
    name: "taskledger.sid",
    secret: process.env.SESSION_SECRET ?? "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.get("/", (req, res) => {
  if (req.session?.userId) return res.redirect("/ui/dashboard");
  return res.redirect("/ui/login");
});

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/tasks", tasksRouter);
app.use("/ui", uiRouter);

module.exports = { app };
