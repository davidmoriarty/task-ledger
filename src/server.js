// src/server.js
require("dotenv").config();

const { app } = require("./app");

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`TaskLedger listening on http://localhost:${port}`);
});

