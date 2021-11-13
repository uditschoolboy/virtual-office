import './App.css';
import MainWindow from './Components/MainWindow/MainWindow';
import ChatWindow from './Components/ChatWindow/ChatWindow';
import ParticipantsWindow from './Components/ParticipantsWindow/ParticipantsWindow';
import Header from './Components/Header/Header';
import { useState } from 'react';

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

  const tempMessage = [
    {
      userName: "Udit Chaudhary",
      text: "HI there"
    },
    {
      userName: "Prince of Persia",
      text: "BYe there"
    },
    {
      userName: "Thor",
      text: "A long long message. A long long message. A long long message. A long long message."
    },
    {
      userName: "Udit Chaudhary",
      text: "HI there"
    },
    {
      userName: "Prince of Persia",
      text: "BYe there"
    },
    {
      userName: "Thor",
      text: "A long long message. A long long message. A long long message. A long long message."
    },
    {
      userName: "Udit Chaudhary",
      text: "HI there"
    },
    {
      userName: "Prince of Persia",
      text: "BYe there"
    },
    {
      userName: "Thor",
      text: "A long long message. A long long message. A long long message. A long long message."
    }
  ];

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
        {windowSettings === 1 && <ChatWindow messageList = {tempMessage}/>  }
      </div> 
    </div>
  );
}

export default App;
