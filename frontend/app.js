import * as events from "./events.js";

function App() {
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

    //initialise socket connection
    React.useEffect(() => {
        console.log("init")

        const socket = io("http://localhost:5100");
        setSocket(socket);

        socket.on('connect', () => {
            setSocketConnected(socket.connected);
    
            socket.on('set-users', (users) => {
                setUsers(users);
            });
    
            socket.on('is-gamemaster', () => {
                setIsGameMaster(true);
            });
    
            socket.on('set-gamemaster', (gameMaster) => {
                setGameMaster(gameMaster);
            });
        });
    }, []);

    function onChangeUsername(event) {
        events.createUsername(socket, event.target.value);

        setUsername(event.target.value);
    }

    function onChangeRoomId(event) {
        setJoinRoomId(event.target.value);
    }

    function onClickCreateRoom(event) {
        events.createRoom(socket, setRoomId);
    }

    function onClickJoinRoom(event) {
        if(joinRoomId == "") return;

        events.joinRoom(socket, joinRoomId, setRoomId);
    }

    function onClickLeaveRoom(event) {
        events.leaveRoom(socket, roomId, setRoomId);
    }

    function handleSubmit(event) {

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
                <input type="text" placeholder="Enter question"></input>
                <button>Submit</button>
            </div>
            : <div className="flex-container">
                <h3>Wait for the game master, {gameMaster}!</h3>
            </div>}
            <button onClick={onClickLeaveRoom}>Leave Room</button>
        </section>}
      </main>
    );
}


ReactDOM.render(
    <App/>,
    document.getElementById('container')
);