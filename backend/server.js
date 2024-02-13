const { Server } = require("socket.io");

let gameMaster = null;

const io = new Server(5100, {
    cors: {
        origin: ['http://localhost:8080', 'http://127.0.0.1:5000'],
    }
});

io.on("connection", socket => {
    socket.on('setUsername', (username, isSuccessCB) => {
        //set username
        socket.data.username = username;

        isSuccessCB(true, null);
    });

    socket.on('createRoom', (roomId, isSuccessCB) => {
        //check if room exists
        if(io.sockets.adapter.rooms.get(roomId)) {
            isSuccessCB(false);
        }

        socket.join(roomId);

        //update users in room
        io.sockets.in(roomId).emit('setUsers', getUsersInRoom(roomId));

        //set gamemaster
        gameMaster = socket;
        socket.emit('isGamemaster');
        io.sockets.in(roomId).emit('set-gamemaster', gameMaster.data.username);

        isSuccessCB(true);
    });

    socket.on('joinRoom', (roomId, isSuccessCB) => {
        //check if room exists
        if(!io.sockets.adapter.rooms.get(roomId)) {
            isSuccessCB(false);
            return;
        }

        socket.join(roomId);
        io.sockets.in(roomId).emit('setUsers', getUsersInRoom(roomId));
        io.sockets.in(roomId).emit('setGamemaster', gameMaster.data.username);

        isSuccessCB(true);
    });

    socket.on('leaveRoom', (isSuccessCB) => {
        let rooms = [...socket.rooms];
        if(rooms.length === 1) {
            isSuccessCB(false);
            return;
        }

        let roomId = rooms[1]; //[0] is socket id
        socket.leave(roomId);
        io.sockets.in(roomId).emit('setUsers', getUsersInRoom(roomId));

        isSuccessCB(true);
    });
});


function getUsersInRoom(roomId) {
    if(io.sockets.adapter.rooms.get(roomId) == undefined) return [];

    const users = [...io.sockets.adapter.rooms.get(roomId)];

    const usernames = users.map(user => {
        return io.sockets.sockets.get(user).data.username;
    })

    return usernames;
}