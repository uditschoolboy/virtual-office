import React, { useState } from 'react'
import './ChatWindow.css';
import Message from './Message/Message'

const ChatWindow = ({messageList}) => {

    //State for the current message typed in the input box
    const [message, setMessage] = useState('');
    function sendMessage() {

    }

    return (
        <div className="chat-window">
            <div className="chat-header">Meeting Chat</div>
            <div className="messages-container">
                {messageList.map((message, idx) => {
                    return <Message message = {message} key={idx}/>
                })}
            </div>
            <div className="send-message-container">
                <input className="message-input" placeholder="Type message here" value={message} onChange={(e) => setMessage(e.target.value)}/>
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default ChatWindow
