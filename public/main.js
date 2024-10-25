console.log("html working");
const form = document.querySelector("#chat-form");
const msgs = document.querySelector(".msg-input");
const chatBox = document.querySelector(".chat-area");
const socket = io();
const{username, sroom} = (Qs.parse(location.search,{
    ignoreQueryPrefix: true
}));// join chat room
socket.emit("join-room" , {username, sroom})

socket.on("message" , message => {
    console.log(message)
    outputMessage(message)
   chatBox.scrollTop = chatBox.scrollHeight
})

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    //  console.log(e.target.elements.msg.value)
    const send = msgs.value
    // Emitting Message to the server
    socket.emit('chatMessage', send);  
    msgs.value = ""
    msgs.focus()
})

const outputMessage = (message)=>{
    const div = document.createElement("div");
    div.classList.add(".chatStyle")
    div.innerHTML = `<h4 class=" msg-time">${message.user} ${message.time}</h4>
            <h4 class="umsg">${message.text}</h4>`
     chatBox.appendChild(div);
     
}