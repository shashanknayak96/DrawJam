const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

instrument(io, {
  auth: false,
});

httpServer.listen(3000);
