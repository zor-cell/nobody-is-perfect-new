import { socket } from "./socket.js";

function App() {
    const [log, setLog] = React.useState([]);
    const [socketConnected, setSocketConnected] = React.useState(false);

    //input components
    const [username, setUsername] = React.useState("");
    const [roomIdInput, setRoomIdInput] = React.useState(null);
    //final room Id after event
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
    
            socket.on('isGamemaster', (isGameMaster) => {
                //roomRef call
                roomRef.current.setIsGameMasterEvent(isGameMaster);
            });
    
            socket.on('setGamemaster', (gameMaster) => {
                roomRef.current.setGameMasterEvent(gameMaster);
            });

            socket.on('showQuestion', (question) => {
                roomRef.current.showQuestionEvent(question);
            });

            socket.on('setSubmissions', (submissions) => {
                roomRef.current.setSubmissionsEvent(submissions);
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
                logEntry(`Could not create username ${newUsername}!`);
                return;
            }
    
            //logEntry(`Created username ${newUsername}!`);
        });
    
        setUsername(newUsername);
    }

    function changeRoomId(event) {
        const newRoomId = event.target.value;
        setRoomIdInput(newRoomId);
    }

    function createRoom(event) {
        const MAX_ROOM_ID = 100;
        const roomId = Math.floor(Math.random() * MAX_ROOM_ID).toString();

        socket.emit('createRoom', roomId, (isSuccess) => {
            if(isSuccess === false) {
                logEntry(`Could not create room ${roomId}!`);
                return;
            }

            setRoomId(roomId);
            logEntry(`Created room ${roomId}!`);
        });
    }

    function joinRoom(event) {
        if(roomIdInput == "") return;

        socket.emit('joinRoom', roomIdInput, (isSuccess) => {
            if(isSuccess === false) {
                logEntry(`Could not join room ${roomIdInput}!`);
                return;
            }
    
            setRoomId(roomIdInput);
            logEntry(`Joined room ${roomIdInput}!`);
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

       <Room ref={roomRef} logEntry={logEntry} username={username} roomId={roomId}/>

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
        setGameMasterEvent,
        setIsGameMasterEvent,
        showQuestionEvent,
        setSubmissionsEvent
    }));

    //props variables
    const logEntry = props.logEntry;
    const roomId = props.roomId;
    const username = props.username;

    //room variables
    const [users, setUsers] = React.useState([]);
    const [gameMaster, setGameMaster] = React.useState(null);
    const [isGameMaster, setIsGameMaster] = React.useState(false);
    const [question, setQuestion] = React.useState(null);
    const [isShowQuestion, setIsShowQuestion] = React.useState(false);
    const [prompt, setPrompt] = React.useState(null);
    const [submissions, setSubmissions] = React.useState([]);

    function setUsersEvent(users) {
        setUsers(users);
    }

    function setGameMasterEvent(gameMaster) {
        setGameMaster(gameMaster);
    }

    function setIsGameMasterEvent(isGameMaster) {
        setIsGameMaster(isGameMaster);
    }

    function showQuestionEvent(question) {
        setQuestion(question);
        setIsShowQuestion(true);
    }

    function setSubmissionsEvent(submissions) {
        setSubmissions(submissions);
    }

    function changeQuestion(event) {
        setQuestion(event.target.value);
    }

    function changePrompt(event) {
        setPrompt(event.target.value);
    }

    function leaveRoom(event) {
        socket.emit('leaveRoom', (isSuccess) => {
            if(isSuccess === false) {
                logEntry(`Could not leave room ${roomId}!`);
                return;
            }
    
            //setRoomId(null);
            logEntry(`Left room ${roomId}!`);
        });
    }

    function submitQuestion(event) {
        socket.emit('submitQuestion', question, (isSuccess) => {
            if(isSuccess === false) {
                logEntry(`Could not show question ${question}!`);
                return;
            }
    
            logEntry(`Showing question ${question}!`);
        });
    }

    function submitPrompt(event) {
        socket.emit('submitPrompt', prompt, (isSuccess) => {
            if(isSuccess === false) {
                logEntry(`Could not submit prompt "${prompt}"!`);
                return;
            }

            logEntry(`Submitted prompt "${prompt}"!`);
        });
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

            {isShowQuestion ? 
                <div className="flex-container">
                    <p>{question}</p>
                    <input onChange={changePrompt} type="text" placeholder="Enter prompt"></input>
                    <button onClick={submitPrompt}>Submit</button>
                    <p>{submissions.length} / {users.length} Submissions</p>
                </div> : 
                (isGameMaster 
            ? <div className="flex-container">
                <h3>You are the game master!</h3>
                <input onChange={changeQuestion} type="text" placeholder="Enter question"></input>
                <button onClick={submitQuestion}>Submit</button>
            </div>
            : <div className="flex-container">
                <h3>Wait for the game master, {gameMaster}!</h3>
            </div>)}

            {submissions.length >= users.length &&
            <div className="flex-container">
                <p>Submissions:</p>
                {submissions.map((submission, key) => {
                    return <p key={key}>{submission}</p>
                })}
            </div>}

            <button onClick={leaveRoom}>Leave Room</button>
        </section>
    );
});

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);