const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const allUsers = document.getElementById('users');

const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

const chatForm = document.querySelector('#chat-form');
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    //get message
    const text = e.target.elements.msg.value;
    
    //send message to server
    socket.emit('chatMessage', text);

    //clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

})

// output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${' '}${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  allUsers.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    allUsers.appendChild(li);
  });
}