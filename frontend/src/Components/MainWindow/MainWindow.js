import React from 'react'
import './MainWindow.css';
import VideoWindow from './VideoWindow/VideoWindow';

const MainWindow = ({myMediaStream, mediaStream1, mediaStream2, mediaStream3}) => {
    return (
        <div className="main-window">
            {myMediaStream && <VideoWindow muted={true} mediaStream={myMediaStream}/>}
            {mediaStream1 && <VideoWindow mediaStream={mediaStream1}/>}
            {mediaStream2 && <VideoWindow mediaStream={mediaStream2}/>}
            {mediaStream3 && <VideoWindow mediaStream={mediaStream3}/>}
        </div>
    )
}

export default MainWindow
