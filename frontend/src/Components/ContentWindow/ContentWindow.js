import React from 'react'
import './ContentWindow.css';
import VideoWindow from './VideoWindow/VideoWindow';

const ContentWindow = ({screenShare, myMediaStream, mediaStream1, mediaStream2, mediaStream3}) => {
    return (
        <div className="content-window">
            {screenShare && <VideoWindow mediaStream={screenShare}/>}
            {myMediaStream && <VideoWindow muted={true} mediaStream={myMediaStream}/>}
            {mediaStream1 && <VideoWindow mediaStream={mediaStream1}/>}
            {mediaStream2 && <VideoWindow mediaStream={mediaStream2}/>}
            {mediaStream3 && <VideoWindow mediaStream={mediaStream3}/>}
        </div>
    )
}

export default ContentWindow
