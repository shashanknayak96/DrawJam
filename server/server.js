const express = require("express");
const http = require("http");
const cors = require("cors");

const PORT = 4000;

const app = express();
app.use(cors());

app.get("/status", (req, res) => {
  return res.json({
    status: "Running",
  });
});

const server = http.createServer(app);

const initSocket = require("./socket");
initSocket(server);

server.listen(PORT, () => {
  console.log("Server running: ", PORT);
});
