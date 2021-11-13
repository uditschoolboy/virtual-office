import React from 'react'
import './ParticipantsWindow.css';

const ParticipantsWindow = ({participantList}) => {
    return (
        <div className="participants-window">
            {participantList.map(participant => {
                return (
                    <h3>{participant}</h3>
                );
            })}
        </div>
    )
}

export default ParticipantsWindow
