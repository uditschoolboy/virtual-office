import Peer from 'peerjs'
import React, { useEffect, useRef } from 'react'
import './VideoWindow.css';

function VideoWindow({mediaStream, muted}) {
    if(!muted) muted = false;
    let videoRef = useRef(null);
    useEffect(() => {
        if(mediaStream) {
            videoRef.current.srcObject = mediaStream;
            console.log("Setting a video stream in videowindow");
            videoRef.current.play();
        }
        // return () => {
        //     cleanup
        // }
    });
    
    return (
        <div className="video-window">
            <video ref={videoRef} muted={muted}></video>
        </div>
    )
}

export default VideoWindow
