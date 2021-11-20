import ContentWindow from '../ContentWindow/ContentWindow';
import ChatWindow from '../ChatWindow/ChatWindow';
import ParticipantsWindow from '../ParticipantsWindow/ParticipantsWindow';
import Header from '../Header/Header';
import { useState, useEffect, cloneElement } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import './MeetingWindow.css';

let socket;
let peer;
function MeetingWindow() {

  /* state windowSettings used for display options of chatwindow and participant window.
  windowSettings = 0 means show only ContentWindow.
  windowSettings = 1 means show ContentWindow and ChatWindow.
  windowSettings = 3 means show ContentWindow and ParticipantsWindow */

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
    const temp = !handRaised
    setHandRaised(!handRaised);
    socket.emit('handRaise-update', temp);
  }

  //State for audio toggle
  const [audio, setAudio] = useState(true);
  function audioToggle() {
    const temp = !audio;
    //Set audio settings on stream
    myMediaStream.getAudioTracks()[0].enabled = temp;
    setAudio(!audio);
    socket.emit('audio-update', temp);
  }

  //State for video toggle
  const [video, setVideo] = useState(true);
  function videoToggle() {
    const temp = !video;
    //Set video settings on Stream
    myMediaStream.getVideoTracks()[0].enabled = temp;
    setVideo(!video);
    socket.emit('video-update', temp);
  }


  //State for meeting - participants List
  const [userList, setUserList] = useState([]);

  //State for chat - messages List
  const [messageList, setMessageList] = useState([]);


  //State for keeping the id provided by my Peer.
  const [myPeerId, setMyPeerId] = useState(null);

  //State for mymediastream
  const [myMediaStream, setMyMediaStream] = useState(null);
  const [mediaStream1, setMediaStream1] = useState(null);
  const [mediaStream2, setMediaStream2] = useState(null);
  const [mediaStream3, setMediaStream3] = useState(null);
  
  //Mapping streams-slots to peerId
  const peers = {};
  const revPeers = [
    true,
    false,
    false,
    false
  ];

  //Endpoint of server
  const ENDPOINT = "localhost:5000";

  //Set up of client side socket. The client with connect to the server throught this socket
  useEffect(() => {
    const room = "room1";
    const name = "Udit";

    //Connection to client
    socket = io(ENDPOINT);
    console.log(socket);

    //Opening a peer connection, initialising a peer variable
    peer = new Peer(undefined, {
      path: '/peerjs',
      host: '/',
      port: '5000'
    });

    //When a peer connection opens
    peer.on('open', id => {
        console.log("first connection opened");
      //Join the given room with socket
      setMyPeerId(id);
      socket.emit('join-room', {
        userName: name,
        peerId: id,
        room,
        mic: audio,
        camera: video,
        handRaised
      });
    });      


    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(myMediaStream => {
      //Get my media stream and display it.
      setMyMediaStream(myMediaStream);

      //Listen to stream-update event on socket and then call that user to get the user's stream
      socket.on('stream-update', (userPeerId) => {
        //Calling that new user and sending the stream
        console.log(userPeerId, " has joined so i will to call him");
        const call = peer.call(userPeerId, myMediaStream);
        //when that user sends back his stream then update the peers state
        call.on('stream', remoteVideoStream => {
          console.log("okay got a stream from ", userPeerId);
          setUserStream(userPeerId, remoteVideoStream);
        });
      });

      
      //When someother user calls you then you need to reply with your stream
      peer.on('call', call => {
        call.answer(myMediaStream);
        console.log("Received a call");
        console.log(call.peer);
        call.on('stream', remoteVideoStream => {
          console.log("okay got a stream from ", call.peer);
          setUserStream(call.peer, remoteVideoStream);
        });
      });
    });

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
      //console.log('someupdate in userList', users);
      setUserList(users);
    });    

    //When stream stops from a user then remove their audio/video
    socket.on('stream-stop', userPeerId => {
      if(peers[userPeerId]) {
        if(peers[userPeerId] === 1) {
          setMediaStream1(null);
          revPeers[1] = null;
        } else if(peers[userPeerId] === 2) {
          setMediaStream2(null);
          revPeers[2] = null;
        } else {
          setMediaStream3(null);
          revPeers[3] = null;
        }
        peers[userPeerId] = null;
      }
    });

    //when you are kicked out of the meeting
    socket.on('kicked-out', () => {
      socket.disconnect();
    });


  }, [messageList, userList, peers]);


  //function to set A users media stream
  function setUserStream(userPeerId, stream) {
    if(peers[userPeerId]) {
      if(peers[userPeerId] === 1) {
        setMediaStream1(stream);
      } else if(peers[userPeerId] === 2) {
        setMediaStream2(stream);
      } else {
        setMediaStream3(stream);
      }
      return;
    }
    if(!mediaStream1 && !revPeers[1]) {
      console.log("Setting stream 1");
      peers[userPeerId] = 1;
      revPeers[1] = true;
      setMediaStream1(stream);
    } else if(!mediaStream2 && !revPeers[2]) {
      console.log("Setting stream 2");
      revPeers[2] = true;
      peers[userPeerId] = 2;
      setMediaStream2(stream);
    } else if(!mediaStream3 && !revPeers[3]) {
      console.log("Setting stream 3");
      revPeers[3] = true;
      peers[userPeerId] = 3;
      setMediaStream3(stream);
    }
  }



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

  //Function for leave meeting
  function leaveMeeting() {
    console.log("leave meeting function");
    socket.disconnect();
  }

  return (
    <div className="meeting-window">
      <Header 
        meetingTitle = "Meeting-Title"
        chatWindowToggle = {chatWindowToggle} 
        participantsWindowToggle = {participantsWindowToggle}
        audioToggle = {audioToggle}
        videoToggle = {videoToggle}
        handRaiseToggle = {handRaiseToggle}
        audio = {audio}
        video = {video}
        handRaised = {handRaised}
        leaveMeeting = {leaveMeeting}
      />
      <div className="content">
        <ContentWindow
          myMediaStream = {myMediaStream}
          mediaStream1 = {mediaStream1}
          mediaStream2 = {mediaStream2}
          mediaStream3 = {mediaStream3}
        />
        {windowSettings === 2 && <ParticipantsWindow userList = {userList}/>}
        {windowSettings === 1 && <ChatWindow messageList = {messageList} sendMessage = {sendMessage}/>  }
      </div> 
    </div>
  );
}

export default MeetingWindow;
