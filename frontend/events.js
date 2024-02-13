export function createUsername(socket, username) {
    socket.emit('setUsername', username, (isSuccess) => {
        if(isSuccess === false) {
            return `Could not create username ${username}!`;
        }

        return `Created username ${username}!`;
    });

    return "test";
}

export function createRoom(socket, setRoomId) {
    const MAX_ROOM_ID = 100;
    let roomId = Math.floor(Math.random() * MAX_ROOM_ID).toString();

    socket.emit('createRoom', roomId, isSuccess => {
        if(isSuccess === false) {
            return `Could not create room ${roomId}!`;
        }

        setRoomId(roomId);
        return `Created room ${roomId}!`;
    });
}

export function joinRoom(socket, roomId, setRoomId) {
    socket.emit('joinRoom', roomId, isSuccess => {
        if(isSuccess === false) {
            return `Could not join room ${roomId}!`;
        }

        setRoomId(roomId);
        return `Joined room ${roomId}!`;
    });
}

export function leaveRoom(socket, roomId, setRoomId) {
    socket.emit('leaveRoom', isSuccess => {
        if(isSuccess === false) {
            return `Could not leave room ${roomId}`;
        }

        setRoomId(null);
        return `Left room ${roomId}!`;
    });
}

export function showQuestion(socket, question) {
    socket.emit('showQuestion', isSuccess => {
        if(isSuccess === false) {
            return `Could not show question ${question}`;
        }

        return `Showing question ${question}`;
    });
}