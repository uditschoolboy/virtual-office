import React from 'react'
import './Header.css';

const Header = ({meetingTitle, chatWindowToggle, participantsWindowToggle, audioToggle, videoToggle, handRaiseToggle, audio, video, handRaised, leaveMeeting}) => {
    return (
        <div className="header">
            <div className="meeting-title-container">{meetingTitle}</div>
            <div className="buttons-container">
                <button onClick={handRaiseToggle}>
                    {handRaised ? <span className="material-icons button-icons">pan_tool</span> : <span className="material-icons button-icons">do_not_touch</span>}
                </button>
                <button onClick={videoToggle}>
                    {video ? <span className="material-icons button-icons">videocam</span> : <span className="material-icons button-icons">videocam_off</span>}
                </button>
                <button onClick={audioToggle}>
                    {audio ? <i className="material-icons button-icons">mic</i> : <span className="material-icons button-icons">mic_off</span>}
                </button>
                <button onClick={participantsWindowToggle}><span className="material-icons button-icons">people</span></button>
                <button onClick={chatWindowToggle}><span className="material-icons button-icons">chat</span></button>
                <button onClick={leaveMeeting} style={{backgroundColor:"red", cursor:"pointer"}}><span className="material-icons button-icons">call_end</span></button>
            </div>
        </div>
    )
}

export default Header
