const express = require('express')
const http = require('http');
const path = require('path');
const {Server} = require('socket.io');
const formatMessage = require('./utils/ChatMsgObj');
const { userJoin, userFind } = require('./utils/user');


const app = express();
const server = http.createServer(app)
const io = new Server(server);
app.use(express.static(path.join(__dirname, 'public')))
const botName = "BOT"

io.on("connection", (socket)=>{
    console.log("connected on the server", socket.id);
    // user joined the room
    socket.on("join-room", ({username, sroom})=>{
    
        const use = userJoin(socket.id, username, sroom)
        
        socket.join(use.room);
        // welcome message when user connected
        socket.emit("message", formatMessage( botName,"Hello from the socket backend, welcome to the CHAT PANEL"))
        // broadcast to all when user connected except the user who connected
        socket.broadcast.to(use.room).emit("message" ,formatMessage( botName,`A ${use.username} is joined the chat`)); 
        // broadcast message to all the users
        // io.emit("message", formatMessage(botName,"A new user connected"))

        // send room and users info in the room
    })
    

    // Listen to chat messages
    socket.on('chatMessage', message =>{
        console.log(`${message} message receved from client`);
        const user = userFind(socket.id) ;
        io.to(user.room).emit('message' , formatMessage(`${user.username}`,message))
        
    })

    // emit disconnect message to client
    socket.on("disconnect", ()=>{
        console.log("Runs when user disconnect");
        io.emit('message' , `user disconnected`)
        
    })
})



server.listen(8000, ()=>{
    console.log("server created");   
})