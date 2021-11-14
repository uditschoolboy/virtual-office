import { yellow } from 'colors';
import React from 'react'
import './ParticipantsWindow.css';

const ParticipantsWindow = ({userList}) => {    
    return (
        <div className="participants-window">
            <div className="participants-window-header">Participants</div>
            {userList.map((user,idx) => {
                return (
                    <div className="participant-container" key={idx}>
                        <h5>{user.userName}</h5>
                        {user.handRaised && <span className="material-icons button-icons" style={{color:"orange"}}>pan_tool</span>}
                        {user.mic ? <i className="material-icons small-icons">mic</i> : <i className="material-icons small-icons">mic_off</i>}
                        {user.camera ? <span className="material-icons small-icons">videocam</span>: <span className="material-icons small-icons">videocam_off</span>}
                    </div>
                );
            })}
        </div>
    )
}

export default ParticipantsWindow
