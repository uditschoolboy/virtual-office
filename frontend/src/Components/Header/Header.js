import React from 'react'
import './Header.css';

const Header = ({meetingTitle, chatWindowToggle, participantsWindowToggle, audioToggle, videoToggle, screenShareToggle, handRaiseToggle}) => {
    return (
        <div className="header">
            <div className="meeting-title-container">{meetingTitle}</div>
            <div className="buttons-container">
                <button onClick={videoToggle}>Video</button>
                <button onClick={audioToggle}>Audio</button>
                <button onClick={screenShareToggle}>ScrenShare</button>
                <button onClick={participantsWindowToggle}>Participants</button>
                <button onClick={chatWindowToggle}>Chat</button>
                <button onClick={handRaiseToggle}>HandRaise</button>
            </div>
        </div>
    )
}

export default Header
