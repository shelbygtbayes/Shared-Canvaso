var socket
var value = 30;
var b = 100;
var g = 100;
var r = 100;
const url = 'https://sharedcanvaso.herokuapp.com/' ;//or 'http://localhost:3000';
var erase_flag = false;
var clear_flag = false;
function setup(){
    createCanvas(width*14 + 55, height*6);
    background(51);
    
    document.getElementById("Clear").onclick = ClearCanvas;
    document.getElementById("Erase").onclick = eraseCanvas;
    document.getElementById("Draw").onclick = drawCanvas;
    
    socket = io.connect(url, {reconnect: true});
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