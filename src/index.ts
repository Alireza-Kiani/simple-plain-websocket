import express from 'express';
import path from 'path';
import { createServer } from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';

const Express = express();
const httpServer = createServer(Express);

Express.use(express.static(path.join(__dirname, './public')));

httpServer.listen(8080, () => {
    console.log('Running, PORT: 8080');
});

interface User {
    WebSocket: WebSocket;
    name: string;
}

const Rooms = new Map<string, User[]>();
const WebSocketInstance = new WebSocketServer({ server: httpServer, port: 8081 });

interface Join {
    name: string;
    room: string;
}

interface Message {
    message: string,
    room: string 
}

WebSocketInstance.on('connection', (socket, req) => {
    socket.on('message', (data) => {
        const parsedMessage: Join | Message = JSON.parse(data.toString());
        if (!('message' in parsedMessage)) {            
            if (!Rooms.get(parsedMessage.room)) {
                Rooms.set(parsedMessage.room, []);
            }
            Rooms.get(parsedMessage.room)?.push({
                name: parsedMessage.name,
                WebSocket: socket
            });
            console.log(`${parsedMessage.name} joined ${parsedMessage.room}`);
        } else {
            Rooms.get(parsedMessage.room)?.forEach(({ WebSocket: client }) => {
                client.send(`${parsedMessage.room}: ${parsedMessage.message}`);
            })
        }
    });

});