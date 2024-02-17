const { Server } = require("socket.io");

const io = new Server(5100, {
    cors: {
        origin: ['http://localhost:8080', 'http://127.0.0.1:5000'],
    }
});

class Room {
    constructor() {
        this.active = false;
        this.gameMaster = null;
        this.submissions = [];
    }
}
const RoomConfig = new Map(); //[roomId, Room]

io.on("connection", socket => {
    socket.data = {
        username: "", //socket username
    }

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

        //create room stored on server
        const room = new Room();
        room.gameMaster = socket;
        RoomConfig.set(roomId, room);

        socket.emit('isGamemaster', true);
        io.sockets.in(roomId).emit('setGamemaster', RoomConfig.get(roomId).gameMaster.data.username);

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
        io.sockets.in(roomId).emit('setGamemaster', RoomConfig.get(roomId).gameMaster.data.username);

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

    socket.on('submitQuestion', (question, isSuccessCB) => {
        //error handling maybe
        const rooms = [...socket.rooms];
        const roomId = rooms[1];

        io.sockets.in(roomId).emit('showQuestion', question);
        isSuccessCB(true);
    });

    socket.on('submitPrompt', (prompt, isSuccessCB) => {
        //store all prompts
        //send back amount of prompts submitted
        isSuccessCB(false);

        socket.data.prompt = prompt;
        console.log("socket data:", socket.data);

        //add prompt to room submissions
        const rooms = [...socket.rooms];
        const roomId = rooms[1];
        RoomConfig.get(roomId).submissions.push(prompt);

        //show amount of submissions
        io.sockets.in(roomId).emit('setSubmissions', RoomConfig.get(roomId).submissions);
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