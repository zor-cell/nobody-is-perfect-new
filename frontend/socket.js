const socket = io("http://localhost:5100");

console.log(socket.connected)
socket.on('connect', () => {
    console.log(socket.connected)
    socket.on('getUsers', () => {

    });
});

export function createUsername(username) {
    socket.emit('setUsername', username, (isSuccess, users) => {
        if(isSuccess === false) {
            console.log(`Could not create username ${username}!`);
            return;
        }

        console.log(users)
        console.log(`Created username ${username}!`);
    });
}

export function createRoom(setRoomId) {
    const MAX_ROOM_ID = 100;
    let roomId = Math.floor(Math.random() * MAX_ROOM_ID).toString();

    socket.emit('createRoom', roomId, isSuccess => {
        if(isSuccess === false) {
            console.log(`Could not create room ${roomId}!`);
            return;
        }

        setRoomId(roomId);
        console.log(`Created room ${roomId}!`);
    });
}

export function joinRoom(roomId, setRoomId) {
    socket.emit('joinRoom', roomId, isSuccess => {
        if(isSuccess === false) {
            console.log(`Could not join room ${roomId}!`);
            return;
        }

        setRoomId(roomId);
        console.log(`Joined room ${roomId}!`);
    });
}

export function leaveRoom(roomId, setRoomId) {
    socket.emit('leaveRoom', isSuccess => {
        if(isSuccess === false) {
            console.log(`Could not leave room ${roomId}`);
            return;
        }

        setRoomId(null);
        console.log(`Left room ${roomId}!`);
    });
}