const socket = io();

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const joinBtn = document.getElementById("joinBtn");
const roomInput = document.getElementById("roomInput");

let localStream;
let roomName;
let peerConnection;

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

joinBtn.addEventListener("click", async () => {
  roomName = roomInput.value.trim();

  if (!roomName) {
    alert("No room name");
    return;
  }

  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  localVideo.srcObject = localStream;

  createPeerConnection();
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });
  socket.emit("join", roomName);
});

function createPeerConnection() {
  console.log("invoked");
  peerConnection = new RTCPeerConnection(config);

  console.log("peerconnection", peerConnection);
  peerConnection.ontrack = (event) => {
    console.log("receiving tracks");
    const [remoteStream] = event.streams;
    remoteVideo.srcObject = remoteStream;
  };
  peerConnection.onicecandidate = (event) => {
    console.log("ICE CANDIDATE");
    if (event.candidate) {
      console.log("SENDING ICE CANDIDATE");
      socket.emit("ice-candidate", {
        candidate: event.candidate,
        room: roomName,
      });
    }
  };
}

socket.on("joined", async ({ room, isInitiator }) => {
  console.log("Joined room:", room, "Initiator:", isInitiator);

  if (!peerConnection) {
    createPeerConnection();
  }

  if (!localStream) {
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  }

  roomName = room;
});

socket.on("offer", async (data) => {
  console.log("offer received", data);
  createPeerConnection();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  await peerConnection.setRemoteDescription(data.offer);

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("answer", {
    answer,
    room: roomName,
  });
});

socket.on("answer", async (data) => {
  console.log("answer received", data);
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );
});

socket.on("ready-for-offer", async (otherUserId) => {
  console.log("GETTING OFFER");
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("offer", {
    offer,
    room: roomName,
  });
});

socket.on("ice-candidate", async (data) => {
  console.log("getting ice candidates", data);
  try {   
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  } catch (err) {
    console.error("Error adding received ice candidate", err);
  }
});
    

     