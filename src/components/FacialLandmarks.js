import * as React from 'react';
import * as facemesh from '@tensorflow-models/facemesh';
import * as Utils from '../utils';
import './FacialLandmarks.scss';
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
    const [ isFaceTiltTooLarge, setIsFaceTiltTooLarge ] = React.useState(false);
    const [ isPhotoUploaded, setIsPhotoUploaded ] = React.useState(false);

    const photoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const hairRef = React.useRef(null);

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

    const setFaceGeometry = async (face, canvas, ctxWidth) => {
        setIsLoading(false);
        const ctx = await canvas.getContext('2d');
        const [height, width, polarAngle, topOfHead, chin] = Utils.crop(face, ctx, ctxWidth);
        setIsFaceTiltTooLarge(!Utils.checkPolarAngle(polarAngle));
        if (Utils.checkPolarAngle(polarAngle)) {
            setHeight(height);
            setWidth(width);
            setTopOfHead(topOfHead);
            setChin(chin);
            setPolarAngle(polarAngle);
        }
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

    const renderWarning = () => {
        return (
            <div className="warning-container">
                <h2>Your face is tilted. Please upload a different photo.</h2>
            </div>
        );
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            setIsPhotoUploaded(true);
            runFacemesh();
            const imgTag = photoRef.current;
            imgTag.onload = () => {
                URL.revokeObjectURL(imgTag.src);
            }
            imgTag.src = URL.createObjectURL(files[0]);
        }
    };

    return (
        <div className="facial-landmarks-container">
            <div className="facemesh-container">
                <div className={`photo-container ${isLoading || isFaceTiltTooLarge ? 'loading' : ''}`} style={{width: 480}}>
                    <div className="image-container">
                        <img ref={photoRef} src="#" style={IMAGE_STYLE} alt="user-profile" />
                    </div>
                    <canvas
                        ref={canvasRef}
                        style={IMAGE_STYLE}
                        className={`${isLoading || isFaceTiltTooLarge? 'hidden' : ''}`}
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
                {isFaceTiltTooLarge ? renderWarning() : null}
                <div className="upload-button">
                    <input type="file" onChange={handleImageUpload}/>
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
