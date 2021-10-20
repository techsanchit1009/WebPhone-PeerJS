const peer = new Peer(''+Math.floor(Math.random()*2**18).toString(36).padStart(4,0), {
  host: location.hostname,
  debug: 1,
  path: '/myapp',
  port: '5001'
});
window.peer = peer;

let code;
let conn;

const callBtn = document.querySelector('.call-btn');
const audioContainer = document.querySelector('.call-container');
const hangUpBtn = document.querySelector('.hangup-btn');


callBtn.addEventListener('click', function(){
  getStreamCode();
  connectPeers();
  const call = peer.call(code, window.localStream);

  call.on('stream', function(stream) { 
      window.remoteAudio.srcObject = stream;
      window.remoteAudio.autoplay = true; 
      window.peerStream = stream;
      showConnectedContent();
  });
});

hangUpBtn.addEventListener('click', function (){
  conn.close();
  showCallContent();
});

peer.on('open', function () {
  document.getElementById('caststatus').textContent = `Your device ID is: ${peer.id}`;
});

peer.on('connection', function(connection){
  conn = connection;
});

peer.on('call', function(call) {
  const answerCall = confirm("Do you want to answer?")

  if(answerCall){ 
      call.answer(window.localStream)
      showConnectedContent();
      call.on('stream', function(stream) {
          window.remoteAudio.srcObject = stream;
          window.remoteAudio.autoplay = true;
          window.peerStream = stream;
      });
      conn.on('close', function (){
        showCallContent();
      });
  } else {
      console.log("call denied"); 
  }
});

function showCallContent() {
  window.caststatus.textContent = `Your device ID is: ${peer.id}`;
  callBtn.hidden = false;
  audioContainer.hidden = true;
}

function showConnectedContent() {
  window.caststatus.textContent = `You're connected`;
  callBtn.hidden = true;
  audioContainer.hidden = false;
}

function getStreamCode() {
  code = window.prompt('Please enter the sharing code');
}

function connectPeers() {
  conn = peer.connect(code);
}

(function getLocalStream() {
  navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream => {
      window.localStream = stream;
      window.localAudio.srcObject = stream; 
      window.localAudio.autoplay = true; 
  }).catch( err => {
      console.log("u got an error:" + err)
  });
})();