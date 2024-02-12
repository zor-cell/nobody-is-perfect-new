import * as socket from "./socket.js";

function App() {
    //input components
    const [username, setUsername] = React.useState("");
    const [joinRoomId, setJoinRoomId] = React.useState("");

    //room components
    const [roomId, setRoomId] = React.useState(null);
    const [users, setUsers] = React.useState([]);

    function onChangeUsername(event) {
        socket.createUsername(event.target.value);

        setUsername(event.target.value);
    }

    function onChangeRoomId(event) {
        setJoinRoomId(event.target.value);
    }

    function onClickCreateRoom(event) {
        socket.createRoom(setRoomId);
    }

    function onClickJoinRoom(event) {
        if(joinRoomId == "") return;

        socket.joinRoom(joinRoomId, setRoomId);
    }

    function onClickLeaveRoom(event) {
        socket.leaveRoom(roomId, setRoomId);
    }

    return (
      <main>
        <h1 id="header">Nobody is Perfect</h1>

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
                <h3>Username: {username}</h3>
            </div>

            <div className="flex-container">
                <h3>Users connected!</h3>
                <ul>
                    <li>test</li>
                </ul>
            </div>
            <button onClick={onClickLeaveRoom}>Leave Room</button>
        </section>}
      </main>
    );
}


ReactDOM.render(
    <App/>,
    document.getElementById('container')
);