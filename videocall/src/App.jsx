import { Routes, Route } from "react-router-dom";
import Home from "./home";
import VideoCall from "./VideoCall";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<VideoCall />} />
    </Routes>
  );
}

export default App;
