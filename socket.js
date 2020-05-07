let lastScrollTop = 0;
let scrollEnabled = true;
let sessionID = null;
let lastMsgId = null;
let msgIdNow = null;
let onlineUsers = 0;
let socketUrl = "https://brave-juniper-red.glitch.me";
let enableSideNavN = false;
let selectMediaEnabled = false;
let msgType = "msg";
const enableSideNav = () => {
    const side_nav = document
    .getElementsByClassName("side-nav")[0];
    const app_content = document
    .getElementsByClassName("app-content")[0];
    const input_place = document
    .getElementsByClassName("input-place")[0];
    if(enableSideNavN == false){
    input_place.style.transition = "0.5s";
    app_content.style.transition = "0.5s";
    side_nav.style.left = "0";
    app_content.style.left = side_nav.clientWidth+"px";
    input_place.style.left = side_nav.clientWidth+"px";
    enableSideNavN=true;
    }else {
    side_nav.style.left = -side_nav.clientWidth+"px";
    app_content.style.left = "0";
    input_place.style.left = "0";
    setTimeout(() => {
    app_content.style.transition = "0s";
    input_place.style.transition = "0s";
    }, 500);
    enableSideNavN=false;
    }
}

//mockup 

var mockUpForMedia = (url) => {
    return `
    <div class="media-box">
    <img src="${url}" onerror="imgError(this)"/>
    <div class="media-filler"></div>
    </div>`;
}

var mockUpForMyMedia = (url) => {
    return `
    <div class="my-media-box">
    <div class="media-filler"></div>
    <img src="${url}" onerror="imgError(this)"/>
    </div>`;
}

var mockUpForMsg = (msgText) => {
    return `
    <div class="msg-box">
    <div class="msg-cnt">${msgText}</div>
    <div class="msg-filler"></div>
    </div>`;
}

var mockUpForMyMsg = (msgText) => {
    return `
    <div class="my-msg-box">
    <div class="msg-filler"></div>
    <div class="msg-cnt">${msgText}</div>
    </div>`;
}

var mockUpForInfoLine = (lineText) => {
    return `
    <div class="info-line">
    <div class="line"></div>
    <div class="line-text">${lineText}</div>
    <div class="line"></div>
    </div>`;
}

var mockUpForName = (name) => {
    return `
    <div class="name-layout">
    <img class="name-img" src="https://joeschmoe.io/api/v1/${name}"/>
    <div class="name-text">${name}</div>
    <div class="name-filler"></div>
    </div>`;
}

var mockUpForMyName = (name) => {
    return `
    <div class="my-name-layout">
    <div class="name-filler"></div>
    <div class="name-text">${name}</div>
    <img class="name-img" src="https://joeschmoe.io/api/v1/${name}"/>
    </div>`;
}

//socket connection

var connectionOptions = {
    "force new connection" : true,                 
    "reconnectionAttempts": "Infinity", 
    "transports" : ["websocket"] 
};

var socket = io(socketUrl, connectionOptions);

//send msg

const sendMsg = () => {
    const input_field = document
    .getElementsByClassName("input-field")[0];
    if(input_field.innerHTML
    .replace(/\s+/g, '') != ""){
    var msgText = input_field.innerHTML
    .split("<").join("&lt;");
    socket.emit('chat message', {msgText, msgType});
    }
    if(selectMediaEnabled == true){
    document
    .getElementsByClassName("select-media")[0]
    .innerHTML = 
    "<i class='material-icons'>add</i>";
    input_field.placeholder = "Type simething...";
    msgType = "msg";
    selectMediaEnabled = false;
    }
    input_field.innerHTML = "";
}

socket.on('chat message', function(data){
    const chat_content = document
    .getElementsByClassName("chat-content")[0];
    lastMsgId = msgIdNow;
    msgIdNow = data.sid;
    if(lastMsgId != msgIdNow){
    if(sessionID == data.sid){
        chat_content 
        .innerHTML += mockUpForMyName(sessionID);
    }else {
        chat_content 
        .innerHTML += mockUpForName(data.sid);
    }
    }
    if(data.sid == sessionID){
    if(data.msg.msgType == "msg"){
    chat_content 
    .innerHTML += mockUpForMyMsg(data.msg.msgText
    .split("<").join("&lt;"));
    }else if(data.msg.msgType == "media"){
    chat_content 
    .innerHTML += mockUpForMyMedia(data.msg.msgText
    .split("<").join("&lt;"));    
    }
    }else {
    if(data.msg.msgType == "msg"){
    chat_content 
    .innerHTML += mockUpForMsg(data.msg.msgText
    .split("<").join("&lt;"));
    }else if(data.msg.msgType == "media"){
    chat_content 
    .innerHTML += mockUpForMedia(data.msg.msgText
    .split("<").join("&lt;"));    
    }    
    }
   
    if(scrollEnabled == true){
        chat_content
        .scrollTo(0, chat_content.scrollHeight); 
    }
});

socket.on('connect', function(){ 
    if(document
    .getElementsByClassName("loader-layout")[0]){
    document
    .getElementsByClassName("loader-layout")[0]
    .outerHTML = "";
    }
    sessionID = socket.io.engine.id; 
    const side_img = document
    .getElementsByClassName("side-img")[0];
    side_img
    .src = https://joeschmoe.io/api/v1/${sessionID};
    const side_name = document
    .getElementsByClassName("side-name")[0];
    side_name
    .innerHTML = sessionID;
});

socket.on('socket id', function(sid){