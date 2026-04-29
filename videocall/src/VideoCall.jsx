import { useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import "./VideoCall.css";
import { useState } from "react";




function VideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const { roomId } = useParams();
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const socket = useRef(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);



  const toggleMic = () => {
  const audioTrack = localStream.current
    ?.getAudioTracks()[0];

  if (!audioTrack) return;

  audioTrack.enabled = !audioTrack.enabled;
  setMicOn(audioTrack.enabled);
};


const toggleCamera = () => {
  const videoTrack = localStream.current
    ?.getVideoTracks()[0];

  if (!videoTrack) return;

  videoTrack.enabled = !videoTrack.enabled;
  setCameraOn(videoTrack.enabled);
};

  // =====================
  // START CAMERA
  // =====================
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideoRef.current.srcObject = stream;
    localStream.current = stream;
  };

  // =====================
  // CREATE PEER CONNECTION
  // =====================
  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
      console.log("Remote stream received");
    }; // used to recive other person's video

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("ice-candidate", {
        roomId,
        candidate: event.candidate
        });

      }
    };

    console.log("Peer connection created");
  };

  // =====================
  // ADD TRACKS
  // =====================
  const addTracks = () => {
    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    console.log("Tracks added");
  };

  // =====================
  // CONNECT SOCKET
  // =====================
  const connectSocket = () => {
   socket.current = io();
    socket.current.emit("join-room", roomId);

    socket.current.on("offer", async (offer) => {
      await peerConnection.current.setRemoteDescription(offer);

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.current.emit("answer", {
      roomId,
      answer
      });

      console.log("Answer sent");
    });

    socket.current.on("answer", async (answer) => {
      await peerConnection.current.setRemoteDescription(answer);
      console.log("Answer received");
    });

  socket.current.on("ice-candidate", async ({ candidate }) => {
  if (candidate) {
    await peerConnection.current.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  }
});


    console.log("Socket connected");
  };


  const startCall = async () => {
  if (!peerConnection.current) {
    alert("Create connection first");
    return;
  }

  if (!localStream.current) {
    alert("Start camera first");
    return;
  }

  const senders = peerConnection.current.getSenders();
  if (senders.length === 0) {
    alert("Add tracks first");
    return;
  }

  const offer = await peerConnection.current.createOffer();
  await peerConnection.current.setLocalDescription(offer);

  socket.current.emit("offer", {
    roomId,
    offer
  });
  console.log("CALL STARTED — offer sent");
};


  // =====================
  // UI
  // =====================
  return (
    <div className="vc-page">
    <div className="vc-card">
      <h2 className="vc-title">WebRTC Video Call</h2>
      <p className="vc-room">Room: {roomId}</p>

      <div className="vc-controls">
        <button className="vc-btn" onClick={createPeerConnection}>
          Create Connection
        </button>

        <button className="vc-btn" onClick={startCamera}>
          Start Camera
        </button>

        <button className="vc-btn" onClick={addTracks}>
          Add Tracks
        </button>

        <button className="vc-btn" onClick={connectSocket}>
          Connect Socket
        </button>

        <button className="vc-call-btn" onClick={startCall}>
          📞 Start Call
        </button>
      </div>

      <div className="vc-video-grid">
        <div className="vc-video-box">
          <p className="vc-label">You</p>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="vc-video"
          />
          <button className="vc-btn" onClick={toggleMic}>
          {micOn ? "🎤 Mute" : "🔇 Unmute"}
          </button>

          <button className="vc-btn" onClick={toggleCamera}>
          {cameraOn ? "📷 Camera Off" : "📸 Camera On"}
          </button>

        </div>

        <div className="vc-video-box">
          <p className="vc-label">Remote</p>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="vc-video"
          />
        </div>
      </div>
    </div>
  </div>
  );
}

export default VideoCall;
