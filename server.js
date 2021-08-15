const path = require('path');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const formatMessages = require('./utilities/messages');
const {userJoin, getCurrentUser, userLeaves, getRoomUsers} = require('./utilities/users'); 

 const server = http.createServer(app);

 const io = socketio(server);

 //set a static folder
 app.use(express.static(path.join(__dirname, 'public')));


 //run when a new user coonnects
io.on('connection', socket => {
    socket.on('joinRoom', ({username,room})=>{
        const user = userJoin(username, socket.id, room);
        socket.join(user.room);

        //Welcome new user
        socket.emit('message', formatMessages("TattleBot", "Welcome to Tattle"));

        //When a new user connects
        socket.broadcast.to(user.room).emit('message', formatMessages("TattleBot", `${user.username} has connected`));

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    });

     //listen for message sent from client
     socket.on('chatMessage', (text)=>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessages(user.username, text));
    })
    
    //When user disconnects
    socket.on('disconnect', ()=>{
        const user = userLeaves(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessages("TattleBot", `${user.username} has disconnected`));   
        }

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });

   
});

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})