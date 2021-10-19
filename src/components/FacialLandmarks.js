import * as React from 'react';
import * as facemesh from '@tensorflow-models/facemesh';
import { crop } from '../utils';
import Webcam from 'react-webcam';
import './FacialLandmarks.scss';
import TestPhoto from '../assets/test_photo.jpeg';
import TestPhoto2 from '../assets/test_photo_2.jpeg';
import TestPhoto3 from '../assets/test_photo_3.jpeg';
import { HAIRS } from '../data/hair';
import * as tf from '@tensorflow/tfjs';

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
    const [ width, setWidth ] = React.useState(0);
    const [ polarAngle, setPolarAngle ] = React.useState(0);
    const [ topOfHead, setTopOfHead ] = React.useState([0, 0]);
    const [ chin, setChin ] = React.useState([0, 0]);
    const [ height, setHeight ] = React.useState(0);
    const [ hair, setHair ] = React.useState(0);

    const webcamRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const photoRef = React.useRef(null);
    const hairRef = React.useRef(null);

    const setFaceGeometry = (face, canvas, ctxWidth) => {
        setIsLoading(false);
        const ctx = canvas.getContext('2d');
        const [height, width, polarAngle, topOfHead, chin] = crop(face, ctx, ctxWidth);
        setHeight(height);
        setWidth(width);
        setPolarAngle(polarAngle);
        setTopOfHead(topOfHead);
        setChin(chin);
    };

    const runFacemesh = async () => {
        const net = await facemesh.load({
            inputResolution: { width: 640, height: 480 },
            scale: 0.8
        });
        if (choice === 'video') {
            detectVideo(net);
        } else if (choice === 'photo') {
            detectPhoto(net);
        }
    };

    const detectVideo = async (net) => {
        if (
            typeof webcamRef.current !== 'undefined' &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const face = await net.estimateFaces(video);
            requestAnimationFrame(() => {
                setFaceGeometry(face, canvas, video.videoWidth);
            });
            detectVideo(net);
        }
    };

    const detectPhoto = async (net) => {
        const photo = photoRef.current;
        const canvas = canvasRef.current;
        canvas.width = photo.width;
        canvas.height = photo.height;
        const face = await net.estimateFaces(photo);
        setFaceGeometry(face, canvas, photo.width);
    };
    
    React.useEffect(
        () => {
            if (webcamRef.current || photoRef.current) {
                runFacemesh();
            }
        },
        [webcamRef, photoRef, choice]
    );

    const getFaceMesh = (e) => {
        setChoice(e.target.value);
    };

    const getRatio = (width, index) => {
        return width / HAIRS[index].forehead[0];
    };

    const getHairStyles = (index) => ({
        width: `${getRatio(width, index) * HAIRS[index].width}px`,
        left: topOfHead[0] - 1 * getRatio(width, index) * (HAIRS[index].width - HAIRS[index].forehead[0] + HAIRS[index].foreheadOffSet[0]),
        top: topOfHead[1] - 1 * getRatio(width, index) * (HAIRS[index].height - HAIRS[index].forehead[1] + HAIRS[index].foreheadOffSet[1]),
        zIndex: isLoading ? -1 : 99,
        transform: `rotateZ(${polarAngle}deg)`,
        display: isLoading ? 'none' : 'block'
    });

    const handleSetHair = (change) => {
        if ( hair + change >= 0 && hair + change < HAIRS.length) {
            setHair(hair + change);
        }
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
                <div className={`webcam-container ${isLoading ? 'loading' : ''}`} style={{width: 480}}>
                    {
                        choice === 'photo' ?
                        <img ref={photoRef} src={TestPhoto} style={IMAGE_STYLE} alt="user-profile"/> :
                        <Webcam ref={webcamRef} style={WEBCAM_STYLE} />
                    }
                    <canvas
                        ref={canvasRef}
                        style={choice === 'video' ? WEBCAM_STYLE : IMAGE_STYLE}
                    />
                    <img 
                        ref={hairRef}
                        src={HAIRS[hair].name} 
                        alt="hair-option" 
                        id="hair-option"
                        className="hair-option" 
                        style={getHairStyles(hair)}
                    />
                </div>
                <div className="buttons-container">
                    <button onClick={() => handleSetHair(-1)}>-</button>
                    <button onClick={() => handleSetHair(1)}>+</button>
                </div>
            </div>
        </div>
    );
};

export default FacialLandmarks;
