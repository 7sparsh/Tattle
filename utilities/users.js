const users = [];


// join current user to chat
function userJoin(username, id, room) {
    const user = {username, id, room};
    users.push(user);
    return user;
}

//get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//user leaves
function userLeaves(id){
    const idx = users.findIndex(user =>  user.id === id);
    if(idx!== -1){
        return users.splice(idx,1)[0];
    }
}

//get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUsers
}

