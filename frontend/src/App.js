import './App.css';
import MainWindow from './Components/MainWindow/MainWindow';
import ChatWindow from './Components/ChatWindow/ChatWindow';
import ParticipantsWindow from './Components/ParticipantsWindow/ParticipantsWindow';
import Header from './Components/Header/Header';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;
function App() {

  /* state windowSettings used for display options of chatwindow and participant window.
  windowSettings = 0 means show only MainWindow.
  windowSettings = 1 means show MainWindow and ChatWindow.
  windowSettings = 3 means show MainWindow and ParticipantsWindow */
  const [windowSettings, setWindowSettings] = useState(0);
  function participantsWindowToggle() {
    if(windowSettings === 2) {
      setWindowSettings(0);
    } else {
      setWindowSettings(2);
    }
  }
  function chatWindowToggle() {
    if(windowSettings === 1) {
      setWindowSettings(0);
    } else {
      setWindowSettings(1);
    }
  }

  //State for handRaise
  const [handRaised, setHandRaised] = useState(false);
  function handRaiseToggle() {
    setHandRaised(!handRaised);
  }

  //State for audio toggle
  const [audio, setAudio] = useState(true);
  function audioToggle() {
    setAudio(!audio);
  }

  //State for video toggle
  const [video, setVideo] = useState(true);
  function videoToggle() {
    setVideo(!video);
  }

  //State for Screen Share
  const [screenShare, setScreenShare] = useState(false);
  function screenShareToggle() {
    setScreenShare(!screenShare);
  }

  //State for meeting - participants List
  const [userList, setUserList] = useState([]);

  //State for chat - messages List
  const [messageList, setMessageList] = useState([]);

  //Endpoint of server
  const ENDPOINT = "localhost:5000";

  //Set up of client side socket. The client with connect to the server throught this socket
  useEffect(() => {
    const room = "room1";
    const name = "Udit";

    //Connection to client
    socket = io(ENDPOINT);
    console.log(socket);

    //Joining the given room
    socket.emit('join-room', {room, name});

    //Cleanup in useEffect
    // return () => {
    //   socket.emit('disconnect');
    //   socket.off();
    // }
  }, [ENDPOINT]);

  useEffect(() => {

    //When client receives a new message from server
    socket.on('message-receive', message => {
      //Adding the message received to the messageList
      setMessageList([...messageList, message]);
    });

    //When client recieves info about the participants of the meeting
    socket.on('room-info', users => {
      console.log('someupdate in userList', users);
      setUserList(users);
    });    

  }, [messageList, userList]);


  //Function to send message from this client to server.
  function sendMessage(messageText) {
    let text = messageText.trim();
    if(text.length === 0) return;
    const message = {text, userName: "Udit"};

    //Sending the message to others
    socket.emit('message-send', message);

    //Adding the message to messageList
    setMessageList([...messageList, message]);
  }

  return (
    <div className="app">
      <Header 
        meetingTitle = "Meeting-Title"
        chatWindowToggle = {chatWindowToggle} 
        participantsWindowToggle = {participantsWindowToggle}
        audioToggle = {audioToggle}
        videoToggle = {videoToggle}
        handRaiseToggle = {handRaiseToggle}
      />
      <div className="content">
        <MainWindow/>
        {windowSettings === 2 && <ParticipantsWindow userList = {userList}/>}
        {windowSettings === 1 && <ChatWindow messageList = {messageList} sendMessage = {sendMessage}/>  }
      </div> 
    </div>
  );
}

export default App;
