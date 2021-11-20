const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const colors = require('colors');

//Make Http server with app variable
const server = http.createServer(app);

//Use cors
app.use(cors());


//running peer on this express server
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});


//Set up socket.io with cors for all clients
const io = socketio(server, {
    cors : {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

//Set up peerjs route
app.use('/peerjs', peerServer);

//Util methods for user management
const {getUserById, getUsersInRoom, removeUser, addUser, changeMicStatus, changeCameraStatus, changeHandStatus} = require('./utils/userUtils');

//When someone connects to this server
io.on('connection', socket => {
    //When someone joins a room
    socket.on('join-room', (user) => {
        //Join the room and inform other in the room about the new connection
        const room = user.room;
        //socket joins the room
        user['id'] = socket.id;
        console.log("This person joined".yellow);
        console.log(user);
        socket.broadcast.to(room).emit('stream-update', (user.peerId));
        socket.join(user.room);

        //Add this user and update other users with this new user's details.
        addUser(user);
        updateUsersInRoom();

        //When a client generates a new message.
        socket.on('message-send', (message) => {
            console.log(`Message received on server`.magenta.bold);
            //Broadcasting the message to others in the same room
            socket.broadcast.to(room).emit('message-receive', message);
        });



        //Status updates : Handraise, audio on/off, video on/off
        socket.on('handRaise-update', (status) => {
            changeHandStatus(socket.id, status);
            updateUsersInRoom();
        });

        socket.on('audio-update', (status) => {
            changeMicStatus(socket.id, status);
            updateUsersInRoom();
        });

        socket.on('video-update', (status) => {
            changeCameraStatus(socket.id, status);
            updateUsersInRoom();
        });



        //When user disconnects from server
        socket.on('disconnect', () => {
            const user = getUserById(socket.id);
            socket.broadcast.to(room).emit('stream-stop', user.peerId);
            removeUser(socket.id);
            updateUsersInRoom();
            console.log(`${socket.id} has disconnected`.magenta);
        });

        //Function for updating the clients about all the users in room with user details
        function updateUsersInRoom() {
            //Notify all room users about the list of participants
            const allUsersInRoom = getUsersInRoom(room);
            //userList will be sent to client
            const userList = allUsersInRoom.map(user => {
                return {
                    userName: user.userName,
                    mic: user.mic,
                    camera: user.camera,
                    handRaised: user.handRaised
                }
            });
            io.to(room).emit('room-info', userList);
        }
    });
});


//Set up the server on port 5000
server.listen(5000, () => {
    console.log("Start hogaya Server".yellow.bold);
});