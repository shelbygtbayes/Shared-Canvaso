const path = require('path')
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const formatMessage = require('./utils/messages');
const {userJoin , getCurrentUser , userLeave , getRoomUsers} = require('./utils/users');
const io = socketio(server);
app.use(express.static(path.join(__dirname , 'public')));
const botName = 'ChatBot';
// When Client connects to server
io.on('connection',socket => {
    console.log('New Web Socket connection');
    // When user disconnect
    socket.on('JoinRoom', ({username , room}) => {
        const user = userJoin(socket.id , username , room);
        socket.join(user.room); // Join to the Selected Room
        // Emit to Connecting Client
        socket.emit('message' , formatMessage(botName , 'Welcome to Shared Canvaso'));
        // Emit to All except the Connecting Client
        //socket.broadcast.emit('message' , formatMessage(botName ,'A User has joined the Chat Box'));
        // To specific room
        socket.broadcast.to(user.room).emit('message' , formatMessage(botName ,`${user.username} has joined the Chat Box`));
        // Send Users and Room info ( If connect )
        io.to(user.room).emit('useroomsinfo' , {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })
    // Recieve the Client Message
    socket.on('chatMessage', msg => {
        // Emit the message to all clients
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message' , formatMessage(user.username ,msg));
        //console.log(msg);
    });
    socket.on('mouse',(data)=>{
        console.log("Recieved & broadcasting : " + data);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('mouse',data);
    });
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            // Emit To all clients
            io.to(user.room).emit('message' , formatMessage(botName ,`${user.username} has left the room`));
            
            // Send Users and Room info ( If Disconnect )
            io.to(user.room).emit('useroomsinfo' , {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});
server.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`);
});

// Step1 Create Server , Instantiate the socket.io object with server
// Step2 Create Client Connection
// Step3 Include Path for socket.io client file to front end ( chat.html ) /socket.io/socket.io.js and the main file
