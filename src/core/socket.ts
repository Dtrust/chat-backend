import { Server, Socket } from 'socket.io';
import http from 'http';

export default (http: http.Server) => {

    const io = new Server(http,  { cors: { origin: 'https://skymessenger.herokuapp.com' } } );

    io.on('connection', function(socket: any) {
        socket.on('DIALOGS:JOIN', (dialogId: string) => {
            socket.dialogId = dialogId;
            socket.join(dialogId);
        });
        socket.on('DIALOGS:TYPING', (obj: any) => {
            // socket.to(obj.dialogId).emit('DIALOGS:TYPING', obj)
            socket.broadcast.emit('DIALOGS:TYPING', obj);
        });
    });

    return io;
};
