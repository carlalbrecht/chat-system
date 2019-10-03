const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

const state = require("./state.js");

const PORT = 3000;

state.init().then(() => {
  app.use(express.static("../dist/chat-system"));
  app.use(express.json());
  app.use(cors());

  require("./api/auth.js")(app, __dirname, state);
  require("./api/groups.js")(app, __dirname, state);
  require("./api/users.js")(app, __dirname, state);

  let server = http.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Server listening on ${host}:${port}`);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB server (details follow):");
  console.error(err);
});
