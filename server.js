import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static('public'));

io.on("connection", (socket) => {
    console.log('A player connected:', socket.id);

  // When a player makes a move, broadcast it to all clients
    socket.on('makeMove', (data) => {
     socket.broadcast.emit('moveMade', data); // Send the move to other clients
    });

    socket.on("restartGame", () =>{
        io.emit("gameRestarted");
    });

    
    socket.on("disconnect", () =>{
        io.emit("Player disconnected", socket.id);
    });

});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});


