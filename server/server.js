const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

const PORT = 3000;

app.use(express.static("../dist/chat-system"));
app.use(express.json());
app.use(cors);

require("./api/auth.js")(app, __dirname);

let server = http.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Server listening on ${host}:${port}`);
})
