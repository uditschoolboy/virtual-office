import React from 'react'
import './ParticipantsWindow.css';

const ParticipantsWindow = ({userList}) => {    
    return (
        <div className="participants-window">
            <div className="participants-window-header">Participants</div>
            {userList.map((participant,idx) => {
                return (
                    <h5 key={idx}>{participant}</h5>
                );
            })}
        </div>
    )
}

export default ParticipantsWindow
