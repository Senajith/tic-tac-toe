import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server,
    {
        cors:{
            origin: "*",
            methods: ["GET", "POST"]
          }
    }
);

app.use(cors({
    origin: "*" // Allow only the client origin or "*" for all
  }));

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

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});


