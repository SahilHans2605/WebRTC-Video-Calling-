import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Home.css";

function Home() {
  const [room, setRoom] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
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
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">MajorMeet</h1>
        <p className="home-subtitle">Start or join a secure, high‑quality meeting in seconds.</p>
      </div>

      <div className="home-card">
        <div className="home-actions">
          <button className="home-primary" onClick={createRoom}>
            ➕ Create New Room
          </button>

          <div className="home-join">
            <input
              className="home-input"
              placeholder="Enter room id"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />

            <button className="home-secondary" onClick={joinRoom}>
              Join Room
            </button>
          </div>

          <button
            className="home-instructions-toggle"
            onClick={() => setShowInstructions((prev) => !prev)}
            aria-expanded={showInstructions}
            aria-controls="home-instructions"
          >
            {showInstructions ? "Hide" : "Show"} Quick Instructions
          </button>

          <div
            id="home-instructions"
            className={`home-instructions ${showInstructions ? "is-visible" : ""}`}
          >
            <div className="home-instructions-section">
              <h3>Call Initiator</h3>
              <ol>
                <li>Click Create Connection.</li>
                <li>Click Start Camera.</li>
                <li>Click Add Tracks.</li>
                <li>Click Connect Socket.</li>
                <li>Wait for the receiver to finish the same steps.</li>
                <li>Click Start Call.</li>
              </ol>
            </div>

            <div className="home-instructions-section">
              <h3>Call Receiver</h3>
              <ol>
                <li>Open the room link or enter the room ID.</li>
                <li>Click Create Connection.</li>
                <li>Click Start Camera.</li>
                <li>Click Add Tracks.</li>
                <li>Click Connect Socket.</li>
                <li>Wait for the initiator to click Start Call.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
