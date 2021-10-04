import * as React from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import './FacialLandmarks.scss';

const runFacemesh = async (webcamRef, canvasRef, setIsLoading) => {
    const net = await facemesh.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8
    });
    const timer = setInterval (
        () => {
            detect(webcamRef, canvasRef, net, setIsLoading)
        },
        100
    );
    return timer;
};

const detect = async (webcamRef, canvasRef, net, setIsLoading) => {
    if (
        typeof webcamRef.current !== 'undefined' &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
    ) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        video.width = videoWidth;
        video.height = videoHeight;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        const face = await net.estimateFaces(video);
        setIsLoading(false);
        // console.log(face);
    }
};

const WEBCAM_STYLE = {
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 99,
    width: 640,
    height: 480
};

const FacialLandmarks = (props) => {
    const [ isLoading, setIsLoading ] = React.useState(true);
    const [ hasWebcam, setHasWebcam ] = React.useState(false);
    const webcamRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    React.useEffect(
        () => {
            if (webcamRef.current.state.hasUserMedia) {
                setHasWebcam(true);
                const timer = runFacemesh(webcamRef, canvasRef, setIsLoading);
                return () => clearInterval(timer);
            }
        },
        [isLoading]
    );

    return (
        <div className={`facemesh-container ${isLoading ? 'loading' : ''} ${hasWebcam ? '' : 'hidden'}`}>
            <Webcam
                ref={webcamRef}
                style={WEBCAM_STYLE}
            />
            <canvas
                ref={canvasRef}
                style={WEBCAM_STYLE}
            />
        </div>
    );
};

export default FacialLandmarks;
