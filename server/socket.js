const { Server, Socket } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const { SocketEvent } = require("./enums/SocketEvent");

const rooms = [];
/* 
	rooms: [
		{
			roomId: {
				users: [{
					socketId, username
				}],
				strokes: []
			}
		}
	]
*/

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["https://admin.socket.io", "http://localhost:5173"],
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // Socket dashboard
  instrument(io, {
    auth: false,
    mode: "development",
  });

  io.on("connection", (socket) => {
    const userId = socket.id;

    // Create room
    socket.on(SocketEvent.CREATE_ROOM, ({ username }) => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

      rooms[roomId] = {
        users: [{ socketId: userId, username }],
        strokes: [],
      };

      socket.join(roomId);
      socket.roomId = roomId;

      socket.emit(SocketEvent.ROOM_CREATED, { roomId });

      // Notify users list
      io.to(roomId).emit(SocketEvent.ROOM_USERS_UPDATE, {
        users: rooms[roomId].users.map((u) => u.username),
      });
    });

    // Join room
    socket.on(SocketEvent.JOIN_ROOM, ({ roomId, username }) => {
      // Check if room exists
      if (!rooms[roomId]) {
        // Return error
        socket.emit(SocketEvent.JOIN_ERROR, {
          message: "Room does not exist",
        });
        return;
      }

      socket.join(roomId);
      socket.roomId = roomId;

      rooms[roomId].users.push({
        socketId: socket.id,
        username,
      });

      // Join success
      socket.emit(SocketEvent.JOIN_SUCCESS, {
        roomId,
      });

      // Notify users list
      io.to(roomId).emit(SocketEvent.ROOM_USERS_UPDATE, {
        users: rooms[roomId].users.map((u) => u.username),
      });
    });

    // Receive stroke
    socket.on(SocketEvent.DRAW_STROKE, ({ roomId, stroke }) => {
      if (!rooms[roomId]) return;

      rooms[socket.roomId].strokes.push(stroke);

      // Broadcast to all in the room
      socket.to(roomId).emit(SocketEvent.RECEIVE_STROKE, { stroke });
    });

    // Send strokes
    socket.on(SocketEvent.GET_ROOM_STATE, ({ roomId }) => {
      if (!rooms[roomId]) return;
      socket.emit(SocketEvent.ROOM_STATE, {
        strokes: rooms[roomId].strokes,
      });
      // Notify users list
      io.to(roomId).emit(SocketEvent.ROOM_USERS_UPDATE, {
        users: rooms[roomId].users.map((u) => u.username),
      });
    });

    // Clear strokes
    socket.on(SocketEvent.CLEAR_CANVAS, ({ roomId }) => {
      rooms[roomId].strokes = [];
      io.to(roomId).emit(SocketEvent.CLEAR_CANVAS);
    });

    // Leave server
    socket.on(SocketEvent.LEAVE_SERVER, ({ roomId }) => {
      handleDisconnect(roomId, socket, io);
    });

    socket.on("disconnect", () => {
      handleDisconnect(socket.roomId, socket, io);
    });
  });
}

const handleDisconnect = (roomId, socket, io) => {
  if (!rooms[roomId]) return;

  rooms[roomId].users = rooms[roomId].users.filter(
    (u) => u.socketId !== socket.id
  );
  socket.leave(roomId);

  io.to(roomId).emit(SocketEvent.ROOM_USERS_UPDATE, {
    users: rooms[roomId].users.map((u) => u.username),
  });

  if (rooms[roomId].users.length === 0) {
    delete rooms[roomId];
  }
};

module.exports = initSocket;
