const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const sanitizeHtml = require('sanitize-html');

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on('connection', (socket) => {
    console.log('[a user connected]');

    socket.on('disconnect', () => {
        console.log('[a user disconectted]')
    })

    socket.on('note', (data) => {
        const sanitizedData = sanitizeHtml(data)
        io.emit('note', sanitizedData)
    })
})

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
