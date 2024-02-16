/*const Room = React.forwardRef((props, ref) => {
    //expose functions so parent can call them
    React.useImperativeHandle(ref, () => ({
        setUsersEvent
    }));

    //prop variables
    const socket = props.socket;
    const roomId = props.roomId;
    const username = props.username;
    const [log, setLog] = React.useState(props.log);

    //room variables
    const [users, setUsers] = React.useState([]);
    const [gameMaster, setGameMaster] = React.useState(null);
    const [isGameMaster, setIsGameMaster] = React.useState(false);
    const [question, setQuestion] = React.useState(null);

    function setUsersEvent(users) {
        setUsers(users);
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

export default Room;*/