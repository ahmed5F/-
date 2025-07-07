let localStream;
let peerConnection;

// تهيئة المكالمة
export async function initCall(userId) {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.getElementById('localVideo').srcObject = localStream;
  
  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "turn:your-turn-server.com", username: "user", credential: "pass" }
    ]
  };
  
  peerConnection = new RTCPeerConnection(configuration);
  
  // إضافة تيار المحلي إلى الاتصال
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });
  
  // معالجة مرشحات ICE
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      // إرسال المرشح إلى المستخدم الآخر
      sendIceCandidate(userId, event.candidate);
    }
  };
  
  // معالجة التيار القادم
  peerConnection.ontrack = event => {
    document.getElementById('remoteVideo').srcObject = event.streams[0];
  };
}

// بدء المكالمة
export async function startCall(userId) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  
  // إرسال العرض إلى المستخدم الآخر
  await sendOffer(userId, offer);
}

// معالجة العرض الوارد
export async function handleOffer(userId, offer) {
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  
  // إرسال الإجابة إلى المستخدم الآخر
  await sendAnswer(userId, answer);
}

// معالجة الإجابة الواردة
export async function handleAnswer(answer) {
  await peerConnection.setRemoteDescription(answer);
}

// معالجة مرشح ICE الوارد
export async function handleIceCandidate(candidate) {
  try {
    await peerConnection.addIceCandidate(candidate);
  } catch (error) {
    console.error("Error adding ICE candidate:", error);
  }
}

// إنهاء المكالمة
export function endCall() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
}
