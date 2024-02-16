import { socket } from "./socket.js";

function App() {
    const [log, setLog] = React.useState([]);
    const [socketConnected, setSocketConnected] = React.useState(false);

    //input components
    const [username, setUsername] = React.useState("");
    const [roomId, setRoomId] = React.useState(null);

    const roomRef = React.useRef();

    //initialise socket connection
    React.useEffect(() => {
        logEntry("Connecting to server...");

        socket.on('connect', () => {
            logEntry("Connected to server!");
            setSocketConnected(true);

            socket.on('setUsers', (users) => {
                roomRef.current.setUsersEvent(users);
            });
    
            socket.on('isGamemaster', () => {
                //roomRef call
            });
    
            socket.on('setGamemaster', (gameMaster) => {
                roomRef.current.setGameMasterEvent(gameMaster);
            });
        });
    }, []);

    function logEntry(message) {
        setLog(log => [...log, message]);
    }

    function changeUsername(event) {
        const newUsername = event.target.value;

        socket.emit('setUsername', newUsername, (isSuccess) => {
            if(isSuccess === false) {
                return `Could not create username ${newUsername}!`;
            }
    
            return `Created username ${newUsername}!`;
        });
    
        setUsername(newUsername);
    }

    function changeRoomId(event) {
        const newRoomId = event.target.value;
        setRoomId(newRoomId);
    }

    function createRoom(event) {
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

    function joinRoom(event) {
        if(roomId == "") return;

        socket.emit('joinRoom', roomId, isSuccess => {
            if(isSuccess === false) {
                return `Could not join room ${roomId}!`;
            }
    
            return `Joined room ${roomId}!`;
        });
    }

    return (
      <main>
        <h1 id="header">Nobody is Perfect</h1>

        <div className="flex-container">
            {socketConnected 
                ? <h3>Successfully connected to server!</h3>
                : <h3>Could not connect to Server!</h3>
            }
        </div>

        <section className="main-container">
            <input type="text" onChange={changeUsername} placeholder="Enter username"></input>
            <div className="flex-container">
               <button onClick={createRoom}>Create New Room</button>
               <p>OR</p>
               <input type="text" onChange={changeRoomId} placeholder="Enter Room Id"></input>
               <button onClick={joinRoom}>Join Room</button>
            </div>
        </section>

       <Room ref={roomRef} log={log} username={username} roomId={roomId}/>

        <section className="main-container">
            <div id="log">
                <ul>
                    {log.map((entry, key) => {
                        return <li key={key}>{entry}</li>
                    })}
                </ul>
            </div>
        </section>
      </main>
    );
}

const Room = React.forwardRef((props, ref) => {
    //expose functions so parent can call them
    React.useImperativeHandle(ref, () => ({
        setUsersEvent,
        setGameMasterEvent
    }));

    //props variables
    const [log, setLog] = React.useState(props.log);
    const roomId = props.roomId;
    const username = props.username;

    //room variables
    const [users, setUsers] = React.useState([]);
    const [gameMaster, setGameMaster] = React.useState(null);
    const [isGameMaster, setIsGameMaster] = React.useState(false);
    const [question, setQuestion] = React.useState(null);

    function setUsersEvent(users) {
        setUsers(users);
    }

    function setGameMasterEvent(gameMaster) {
        setGameMaster(gameMaster);
    }

    function leaveRoom(event) {
        const message = events.leaveRoom(socket, roomId, setRoomId);
        setLog([...log, message]);
    }

    function changeQuestion(event) {
        setQuestion(event.target.value);
    }

    function submitQuestion(event) {
        const message = events.showQuestion(socket, question);
        setLog([...log, message]);
    }

    return (
        <section className="main-container" style={{display: (roomId == null && "none")}}>
            <div className="flex-container">
                <h1>Room {roomId}</h1>
                <h2>{username}</h2>
            </div>

            <div className="flex-container">
                <h3>{users.length} user{users.length == 1 ? "" : "s"} connected!</h3>
                <ul>
                    {users.map((user, key) => {
                        return <li key={key}>{user}</li>
                    })}
                </ul>
            </div>

            {isGameMaster 
            ? <div className="flex-container">
                <h3>You are the game master!</h3>
                <input onChange={changeQuestion} type="text" placeholder="Enter question"></input>
                <button onClick={submitQuestion}>Submit</button>
            </div>
            : <div className="flex-container">
                <h3>Wait for the game master, {gameMaster}!</h3>
            </div>}
            <button onClick={leaveRoom}>Leave Room</button>
        </section>
    );
});

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);