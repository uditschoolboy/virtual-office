let users = [];
function addUser(user) {
    users = [...users, user];
    return user;
}

function removeUser(id) {
    users = users.filter(user => user.id !== id);
}

function getUsersInRoom(room) {
    return users.filter(user => user.room === room);
}

function getUserById(id) {
    return users.find(user => user.id === id);
}

function changeMicStatus(id, status) {
    const idx = users.findIndex(user => user.id === id);
    users[idx].mic = status;
}

function changeCameraStatus(id, status) {
    const idx = users.findIndex(user => user.id === id);
    users[idx].camera = status;
}

function changeHandStatus(id, status) {
    const idx = users.findIndex(user => user.id === id);
    users[idx].handRaised = status;
}

module.exports = {addUser, removeUser, getUsersInRoom, getUserById, changeMicStatus, changeHandStatus, changeCameraStatus};