import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${id}`);
  };

  const joinRoom = () => {
    if (!room) return;
    navigate(`/room/${room}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Video Call App</h1>

      <button onClick={createRoom}>
        ➕ Create New Room
      </button>

      <br /><br />

      <input
        placeholder="Enter room id"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <button onClick={joinRoom}>
        Join Room
      </button>
    </div>
  );
}

export default Home;
