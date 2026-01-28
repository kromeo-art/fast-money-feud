const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// This tells the server to serve your HTML and Sound files
app.use(express.static(__dirname));

// This serves the main game page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// The "Walkie-Talkie" logic
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for the Judge revealing an answer or points
  socket.on('reveal-action', (data) => {
    io.emit('show-on-board', data);
  });

  // Listen for the Judge starting the timer
  socket.on('start-timer', (seconds) => {
    io.emit('run-timer', seconds);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// CRITICAL FOR RENDER: 
// We use process.env.PORT because Render assigns a port dynamically.
// We use '0.0.0.0' to ensure it's accessible externally.
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running! Listening on port ${PORT}`);
});