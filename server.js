var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(3000)
console.log("Socket server running");
app.use(express.static('public'));
var io = socket(server);
// Handling the Events
io.sockets.on('connection',(socket)=>{
    console.log("New Connection "+socket.id);
    // On receiving the message
    socket.on('mouse',(data)=>{
        socket.broadcast.emit('mouse',data);
        // io.socket.emit('mouse',data); // globally over socket
        console.log("Recieved & broadcasting : " + data);
    })
})
/*
function newConnection(socket){
   
}*/