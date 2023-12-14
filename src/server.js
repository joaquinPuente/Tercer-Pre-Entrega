import http from 'http';
import app from './app.js';
import config from "./config.js";
import { init } from './db/mongoDB.js';
import { Server } from 'socket.io';
import Message from './models/chat.model.js';

await init();

const serverHttp = http.createServer(app);
const serverSocket = new Server(serverHttp);
const PORT = 8080;

serverHttp.listen(PORT, () => {
    console.log(`Listening on port: http://localhost:${PORT} 🚀`);
});

serverSocket.on('connection', (socketClient) => {
    console.log('Se ha conectado un cliente', socketClient.id);

    socketClient.on('setUsername', (username) => {
        socketClient.username = username;
    });

    socketClient.on('chat message', (data) => {
        const message = new Message({ text: data.text, user: socketClient.username, timestamp: new Date() });
        message.save()
            .then(() => {
                serverSocket.emit('chat message', { text: data.text, user: socketClient.username });
            })
            .catch((error) => {
                console.error('Error al guardar el mensaje:', error);
            });
    });
});
