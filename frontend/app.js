import * as events from "./events.js";

function App() {
    const [log, setLog] = React.useState([]);
    const [socket, setSocket] = React.useState(null);
    const [socketConnected, setSocketConnected] = React.useState(false);

    //input components
    const [username, setUsername] = React.useState("");
    const [joinRoomId, setJoinRoomId] = React.useState("");

    //room components
    const [roomId, setRoomId] = React.useState(null);
    const [users, setUsers] = React.useState([]);
    const [gameMaster, setGameMaster] = React.useState(null);
    const [isGameMaster, setIsGameMaster] = React.useState(false);
    const [question, setQuestion] = React.useState(null);

    //initialise socket connection
    React.useEffect(() => {
        setLog([...log, "init"])

        const socket = io("http://localhost:5100");
        setSocket(socket);

        socket.on('connect', () => {
            setSocketConnected(socket.connected);
    
            socket.on('setUsers', (users) => {
                setUsers(users);
            });
    
            socket.on('isGamemaster', () => {
                setIsGameMaster(true);
            });
    
            socket.on('setGamemaster', (gameMaster) => {
                setGameMaster(gameMaster);
            });
        });
    }, []);

    function onChangeUsername(event) {
        const message = events.createUsername(socket, event.target.value);
        console.log(message)
        setLog([...log, message]);

        setUsername(event.target.value);
    }

    function onChangeRoomId(event) {
        setJoinRoomId(event.target.value);
    }

    function onClickCreateRoom(event) {
        const message = events.createRoom(socket, setRoomId);
        setLog([...log, message]);
    }

    function onClickJoinRoom(event) {
        if(joinRoomId == "") return;

        const message = events.joinRoom(socket, joinRoomId, setRoomId);
        setLog([...log, message]);
    }

    function onClickLeaveRoom(event) {
        const message = events.leaveRoom(socket, roomId, setRoomId);
        setLog([...log, message]);
    }

    function onChangeQuestion(event) {
        setQuestion(event.target.value);
    }

    function onClickQuestion(event) {
        const message = events.showQuestion(socket, question);
        setLog([...log, message]);
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
            <input type="text" onChange={onChangeUsername} placeholder="Enter username"></input>
            <div className="flex-container">
               <button onClick={onClickCreateRoom}>Create New Room</button>
               <p>OR</p>
               <input type="text" onChange={onChangeRoomId} placeholder="Enter Room Id"></input>
               <button onClick={onClickJoinRoom}>Join Room</button>
            </div>
        </section>

        {roomId != null && 
        <section className="main-container">
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
                <input onChange={onChangeQuestion} type="text" placeholder="Enter question"></input>
                <button onClick={onClickQuestion}>Submit</button>
            </div>
            : <div className="flex-container">
                <h3>Wait for the game master, {gameMaster}!</h3>
            </div>}
            <button onClick={onClickLeaveRoom}>Leave Room</button>
        </section>}

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


ReactDOM.render(
    <App/>,
    document.getElementById('container')
);