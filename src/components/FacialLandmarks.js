import * as React from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import { drawMesh } from '../utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import Webcam from 'react-webcam';
import './FacialLandmarks.scss';
import TestPhoto from '../assets/test_photo.jpeg';

const runFacemesh = async (sourceRef, canvasRef, setIsLoading, choice) => {
    const net = await facemesh.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8
    });
    if (choice === 'video') {
        const timer = setInterval (
            () => {
                detectVideo(sourceRef, canvasRef, net, setIsLoading);
            },
            100
        );
        return timer;
    } else if (choice === 'photo') {
        detectPhoto(sourceRef, canvasRef, net, setIsLoading);
    }
};

const detectVideo = async (webcamRef, canvasRef, net, setIsLoading) => {
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
        const ctx = canvas.getContext('2d');
        drawMesh(face, ctx);
    }
};

const detectPhoto = async (photoRef, canvasRef, net, setIsLoading) => {
    const photo = photoRef.current;
    const canvas = canvasRef.current;
    canvas.width = photo.width;
    canvas.height = photo.height;
    const face = await net.estimateFaces(photo);
    setIsLoading(false);
    const ctx = canvas.getContext('2d');
    drawMesh(face, ctx);
}

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

const IMAGE_STYLE = {
    ...WEBCAM_STYLE,
    width: 480,
    height: 480
};

const FacialLandmarks = (props) => {
    const [ isLoading, setIsLoading ] = React.useState(true);
    const [ choice, setChoice ] = React.useState('');
    const webcamRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const photoRef = React.useRef(null);
    
    React.useEffect(
        () => {
            let timer;
            if (webcamRef.current) {
                timer = runFacemesh(webcamRef, canvasRef, setIsLoading, choice);
            } else if (photoRef.current) {
                timer = runFacemesh(photoRef, canvasRef, setIsLoading, choice);
            }
            return () => clearInterval(timer);
        },
        [webcamRef, photoRef, choice]
    );

    const getFaceMesh = (e) => {
        setChoice(e.target.value);
    };

    return (
        <div className="facial-landmarks-container">
            <div className="user-choice-container" onChange={getFaceMesh}>
                <label htmlFor="photo">
                    <p>Photo</p>
                    <input type="radio" name="choice" id="photo" value="photo" />
                </label>
                <label htmlFor="video">
                    <p>Video</p>
                    <input type="radio" name="choice" id="video" value="video" />
                </label>
            </div>
            <div className="facemesh-container">
                <div className={`webcam-container ${isLoading ? 'loading' : ''} `}>
                    {
                        choice === 'photo' ?
                        <img ref={photoRef} src={TestPhoto} style={IMAGE_STYLE} alt="user-profile"/> :
                        <Webcam ref={webcamRef} style={WEBCAM_STYLE} />
                    }
                    <canvas
                        ref={canvasRef}
                        style={choice === 'video' ? WEBCAM_STYLE : IMAGE_STYLE}
                    />
                </div>
            </div>
        </div>
    );
};

export default FacialLandmarks;
