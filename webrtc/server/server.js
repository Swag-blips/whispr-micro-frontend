const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../client")));

const rooms = {};

io.on("connection", (socket) => {
  console.log("socket connected to the server", socket.id);
  socket.on("join", (room) => {
    socket.join(room);

    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(socket.id);

    const otherUsers = rooms[room].filter((id) => id !== socket.id);
    const isInitiator = otherUsers.length === 0;

    socket.emit("joined", { room, isInitiator });
    socket.to(room).emit("user-joined", socket.id);
    if (!isInitiator) {
      const initiatorId = otherUsers[0];
      io.to(initiatorId).emit("ready-for-offer", socket.id);
    }

    console.log("user joined room", socket.id);
    console.log(rooms);
  });

  socket.on("offer", (data) => {
    console.log("offer gotten");
    socket.to(data.room).emit("offer", data);
  });
 
  socket.on("answer", (data) => { 
    console.log("answer gotten", data);
    socket.to(data.room).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.room).emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let room in rooms) {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      if (rooms[room].length === 0) {
        delete rooms[room];
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
