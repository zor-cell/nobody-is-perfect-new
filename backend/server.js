const { Server } = require("socket.io");

const io = new Server(5100, {
    cors: {
        origin: ['http://localhost:8080', 'http://127.0.0.1:5000'],
    }
});

const RoomConfig = {
    usernames: {}, //key: socket id, value: username
};

io.on("connection", socket => {
    socket.on('setUsername', (username, isSuccessCB) => {
        //set username
        RoomConfig.usernames[socket.id] = username;

        isSuccessCB(true, RoomConfig.usernames);

        console.log(RoomConfig.usernames);
    });

    socket.on('createRoom', (roomId, isSuccessCB) => {
        //check if room exists
        if(io.sockets.adapter.rooms.get(roomId)) {
            isSuccessCB(false);
        }

        socket.join(roomId);

        isSuccessCB(true);
    });

    socket.on('joinRoom', (roomId, isSuccessCB) => {
        //check if room exists
        if(!io.sockets.adapter.rooms.get(roomId)) {
            isSuccessCB(false);
            return;
        }

        socket.join(roomId);

        isSuccessCB(true);
    });

    socket.on('leaveRoom', (isSuccessCB) => {
        let rooms = [...socket.rooms];
        if(rooms.length === 1) {
            isSuccessCB(false);
            return;
        }

        let room = rooms[1]; //[0] is socket id
        socket.leave(room);

        isSuccessCB(true);
    });
});