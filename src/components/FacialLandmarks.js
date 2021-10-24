import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactDOM from 'react-dom';
import * as facemesh from '@tensorflow-models/facemesh';
import { crop } from '../utils';
import './FacialLandmarks.scss';
import TestPhoto from '../assets/test_photo.jpeg';
import TestPhoto2 from '../assets/test_photo_2.jpeg';
import TestPhoto3 from '../assets/test_photo_3.jpeg';
import { HAIRS } from '../data/hair';
import * as tf from '@tensorflow/tfjs';

const IMAGE_STYLE = {
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    top: 100,
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 99,
    width: 480,
    height: 480
};

const FacialLandmarks = (props) => {
    const [ isLoading, setIsLoading ] = React.useState(true);
    const [ width, setWidth ] = React.useState(0);
    const [ polarAngle, setPolarAngle ] = React.useState(0);
    const [ topOfHead, setTopOfHead ] = React.useState([0, 0]);
    const [ chin, setChin ] = React.useState([0, 0]);
    const [ height, setHeight ] = React.useState(0);
    const [ hair, setHair ] = React.useState(0);

    const photoRef = React.useRef(null);
    const rotatedPhotoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const hairRef = React.useRef(null);
    
    React.useEffect(
        () => {
            const rotate = async (angle) => {
                await runFacemesh();
            };
            console.log(polarAngle)
            rotate(polarAngle);
        },
        [polarAngle]
    );


    const setFaceGeometry = async (face, canvas, ctxWidth) => {
        setIsLoading(false);
        const ctx = await canvas.getContext('2d');
        const [height, width, polarAngle, topOfHead, chin] = crop(face, ctx, ctxWidth);
        setHeight(height);
        setWidth(width);
        setTopOfHead(topOfHead);
        setChin(chin);
        setPolarAngle(polarAngle);
        ReactDOM.render(getPhoto(TestPhoto, polarAngle), document.getElementsByClassName('image-container')[0]);
    };

    const runFacemesh = async () => {
        const mesh = await facemesh.load({
            inputResolution: { width: 640, height: 480 },
            scale: 0.8
        });
        detectFace(mesh);
    };

    const detectFace = async (mesh) => {
        const photo = photoRef.current;
        const canvas = canvasRef.current;
        canvas.width = IMAGE_STYLE.width;
        canvas.height = IMAGE_STYLE.height;
        const face = await mesh.estimateFaces(photo);
        setFaceGeometry(face, canvas, IMAGE_STYLE.width);
    };

    const getRatio = (width, index) => {
        return width / HAIRS[index].forehead[0];
    };

    const getHairStyles = (index) => ({
        width: `${getRatio(width, index) * HAIRS[index].width}px`,
        left: topOfHead[0] - 1 * getRatio(width, index) * (HAIRS[index].width - HAIRS[index].forehead[0] + HAIRS[index].foreheadOffSet[0]),
        top: topOfHead[1] - 1 * getRatio(width, index) * (HAIRS[index].height - HAIRS[index].forehead[1] + HAIRS[index].foreheadOffSet[1]) + IMAGE_STYLE.top,
        zIndex: isLoading ? -1 : 99,
        transform: `rotateZ(${polarAngle}deg)`,
        display: isLoading ? 'none' : 'block'
    });

    const handleSetHair = (change) => {
        if ( hair + change >= 0 && hair + change < HAIRS.length) {
            setHair(hair + change);
        }
    };

    const getPhoto = (src, polarAngle) => {
        console.log(polarAngle)
        return <img src={src} style={{transform: `rotateZ(-${polarAngle}deg)`}} alt="user-profile-2" />
    };

    return (
        <div className="facial-landmarks-container">
            <div className="facemesh-container">
                <div className={`photo-container ${isLoading ? 'loading' : ''}`} style={{width: 480}}>
                    <div className="image-container">
                        <img ref={photoRef} src={TestPhoto} style={IMAGE_STYLE} alt="user-profile" />
                    </div>
                    <canvas
                        ref={canvasRef}
                        style={IMAGE_STYLE}
                        className='hidden'
                    />
                    {/* <img 
                        ref={hairRef}
                        src={HAIRS[hair].name} 
                        alt="hair-option" 
                        id="hair-option"
                        className="hair-option" 
                        style={getHairStyles(hair)}
                    /> */}
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
