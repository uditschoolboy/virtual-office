import React from 'react'
import './Message.css';

const Message = ({message}) => {
    return (
        <div className="message">
            <div className="user-container">{message.userName}</div>
            <div className="message-container">{message.text}</div>
        </div>
    )
}

export default Message
