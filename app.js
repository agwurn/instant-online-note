const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const sanitizeHtml = require("sanitize-html");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const rooms = {};

// app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {

  const roomId = Math.random().toString(36).substring(7);

  res.redirect(`/room/${roomId}`);
});

app.get("/room/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  console.log(rooms)
  if(!rooms[roomId]){
    rooms[roomId] = true;
  } 

  res.sendFile(path.join(__dirname, "public", "index.html"));
  
})

io.on("connection", (socket) => {
  console.log("[a user connected]");

  socket.on("joinRoom", (roomId) => {
    console.log(`有人加入 ${roomId}`)
    socket.join(roomId);
  })

  socket.on("disconnect", () => {
    console.log("[a user disconectted]");
    Object.keys(rooms).forEach((roomId) => {
      console.log(rooms)
      console.log(roomId)
      if (io.sockets.adapter.rooms[roomId] === undefined){
        delete rooms[roomId];
        console.log(`[房間 ${roomId} 已刪除]`)
      }
    })
  });

  socket.on("note", (data) => {
    const sanitizedData = sanitizeHtml(data);
    const roomId = Array.from(socket.rooms)[1];
    io.to(roomId).emit("note", sanitizedData);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
