const newPeer = new Peer(''+Math.floor(Math.random()*2**18).toString(36).padStart(4,0), {
    host:location.hostname,
    debug:1,
    path:'/myapp'
});

window.peer = newPeer

const getLocalStream = async () => {
    try{
    const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
    window.localStream = stream; // A
    localVideo.srcObject = stream; // B
    window.localVideo.autoplay = true; 
    localVideo.muted = true;

    }
    catch(err) {
        alert(err.message)
    }
}

getLocalStream();

peer.on('open', () => {
    caststatus.textContent = `Your ID is ${peer.id}`
})

const videoContainer = document.querySelector('.call-container');/**
 * Displays the call button and peer ID
 * @returns{void}
 */

function showCallContent() {
    window.caststatus.textContent = `Your device ID is: ${peer.id}`;
    call_btn.hidden = false;
    videoContainer.hidden = true;
}

/**
 * Displays the video controls and correct copy
 * @returns{void}
 */

function showConnectedContent() {
    window.caststatus.textContent = `You're connected`;
    call_btn.hidden = true;
    videoContainer.hidden = false;
}
let ID
let askID = () =>{
    ID = window.prompt('Please Enter ID to connect')
}

let conn
let estabconn = () => {
    conn = peer.connect(ID)
    conn.on('close', ()=> {
        showCallContent()
    })
}

peer.on('connection', (connection) => {
    conn = connection
    
})

const call_btn = document.querySelector(".call-btn")

call_btn.addEventListener('click', ()=> {
    askID();
    estabconn();
    const call = peer.call(ID, window.localStream)

    call.on('stream', (stream)=>{
        window.remoteStream = stream;
        remoteVideo.srcObject = stream; // B
        window.remoteVideo.autoplay = true; 
        remoteVideo.muted = true;
        showConnectedContent();
        
    })

})


peer.on('call', (call)=>{
    let anscon = confirm("Do you wanna Answer?")

    if(anscon) {
        call.answer(window.localStream)
        showConnectedContent();
        call.on('stream', function(stream) { // C
            window.remoteVideo.srcObject = stream;
            window.remoteVideo.autoplay = true;
            window.peerStream = stream;
        
         });
         
        
      } else {
         console.log("call denied"); // D
      }

      conn.on('close', ()=> {
        showCallContent()
    })
})

const hbtn = document.querySelector(".hangup-btn");
hbtn.addEventListener('click', ()=> {
    conn.close();
    showCallContent();
})


