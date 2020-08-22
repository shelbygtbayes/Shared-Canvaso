var value = 30;
var b = 100;
var g = 100;
var r = 100;
const url = 'http://localhost:3000';
var erase_flag = false;
var clear_flag = false;

// Client side
const chartForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const {username , room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
});
//console.log(username , room);
const socket = io();
// Send the Joining room info to the server
socket.emit('JoinRoom' , {username , room});
// Get room and users
socket.on('useroomsinfo' , ({room , users})=>{
    outputRoomName(room);
    outputUserName(users);
});

 //     Event name
// Catch the Message 'Emitted from the server'
socket.on('message' , message => {
   
    outputMessage(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})
chartForm.addEventListener('submit' , (e)=>{
    e.preventDefault();
    // Get element where id = msg and return it's value
    const msg = e.target.elements.msg.value;
    //console.log(msg);
    // Emit Message to Server
    socket.emit('chatMessage' , msg);
    // Clear the Message
    e.target.elements.msg.value = '';
    //e.target.elements.msg.focus(); // Cursor waiting for the message
});

// Message from Server to DOM 
function outputMessage(message){
    // Create a DOM element
    const div = document.createElement('div');
    // Now add another as message
    div.classList.add('message');
    // Define the div
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    // Put the created element in the parent chat-message element
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users name to DOM

function outputUserName(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
function setup(){
    
    let cnv = createCanvas(width*9, height*6 );
    //cnv.position(width/4 + 5, height/6 - 7);
    cnv.parent('sketch-div');
    background(51);
    
    document.getElementById("Clear").onclick = ClearCanvas;
    document.getElementById("Erase").onclick = eraseCanvas;
    document.getElementById("Draw").onclick = drawCanvas;
    
    //socket = io.connect(url, {reconnect: true});
    socket.on('mouse',(data)=>{
        if(!data.clear)
        {
            noStroke();
            clear_flag = 0;
            var pointer_width = data.width;
            if(data.erase)
                fill(51);
            else
                fill(data.red,data.green,data.blue);
            ellipse(data.x,data.y,pointer_width,pointer_width);
        }
        else{
            background(51);
            clear_flag = false;
        }
    })
 }
function eraseCanvas() {
    erase_flag = true;
}
function drawCanvas() {
    clear_flag = false;
    erase_flag = false;
    var data = {
        erase: erase_flag,
        clear: clear_flag,
    }
    socket.emit('mouse',data);
}

function ClearCanvas() {
    clear_flag = true;
    erase_flag = false;
    var data = {
        x : mouseX,
        y : mouseY,
        erase: erase_flag,
        clear: clear_flag,
    }
    socket.emit('mouse',data);
}
// mouseDragged
function touchMoved(){
    var data={
        x : mouseX,
        y : mouseY,
        erase: erase_flag,
        clear: clear_flag,
        width: value,
        red: r,
        green: g,
        blue: b,
    }
    // Name of message + data
    socket.emit('mouse',data);
    console.log("Sending : " + data);
    noStroke();
    if(erase_flag)
        fill(51);
    else
        fill(r,g,b);
    ellipse(mouseX,mouseY,value,value);
}
function draw(){
   if(clear_flag)
        background(51);
    var slider1 = document.getElementById("pointer_slider");
    value = slider1.value;
    var output1 = document.getElementById("pointer_slider_value");
    slider1.oninput = function() {
        output1.innerHTML = this.value;
    }
    var slider2 = document.getElementById("red_color_slider");
    r = slider2.value;
    var output2 = document.getElementById("red_color_slider_value");
    slider2.oninput = function() {
        output2.innerHTML = this.value;
    }
    var slider3 = document.getElementById("green_color_slider");
    g = slider3.value;
    var output3 = document.getElementById("green_color_slider_value");
    slider3.oninput = function() {
        output3.innerHTML = this.value;
    }
    var slider4 = document.getElementById("blue_color_slider");
    b = slider4.value;
    var output4 = document.getElementById("blue_color_slider_value");
    slider4.oninput = function() {
        output4.innerHTML = this.value;
    }   
}