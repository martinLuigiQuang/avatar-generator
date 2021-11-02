import * as React from 'react';
import * as facemesh from '@tensorflow-models/facemesh';
import Utils from '../utils';
import * as Hairs from '../data/hairs';
import * as tf from '@tensorflow/tfjs';
import './FacialLandmarks.scss';

const UTILS = new Utils();

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

const GENDER = 'female';

const FacialLandmarks = (props) => {
    const [ isLoading, setIsLoading ] = React.useState(true);
    const [ width, setWidth ] = React.useState(0);
    const [ polarAngle, setPolarAngle ] = React.useState(0);
    const [ topOfHead, setTopOfHead ] = React.useState([0, 0]);
    const [ chin, setChin ] = React.useState([0, 0]);
    const [ height, setHeight ] = React.useState(0);
    const [ hairIndex, setHairIndex ] = React.useState(0);
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
        const [height, width, polarAngle, topOfHead, chin] = UTILS.crop(face, ctx, ctxWidth);
        setIsFaceTiltTooLarge(!UTILS.checkPolarAngle(polarAngle));
        if (UTILS.checkPolarAngle(polarAngle)) {
            setHeight(height);
            setWidth(width);
            setTopOfHead(topOfHead);
            setChin(chin);
            setPolarAngle(polarAngle);
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
                        src={Hairs.getHair(hairIndex, GENDER)} 
                        alt="hair-option" 
                        id="hair-option"
                        className="hair-option" 
                        style={Hairs.getHairStyles(hairIndex, GENDER, width, topOfHead, polarAngle, isLoading, IMAGE_STYLE)}
                    />
                </div>
                {isFaceTiltTooLarge ? renderWarning() : null}
                <div className="upload-button">
                    <input type="file" onChange={handleImageUpload}/>
                </div>
                <div className="buttons-container">
                    <button onClick={() => {
                        setHairIndex(Hairs.getHairIndex(-1, GENDER, hairIndex))
                    }}>-</button>
                    <button onClick={() => {
                        setHairIndex(Hairs.getHairIndex(1, GENDER, hairIndex))
                    }}>+</button>
                </div>
            </div>
        </div>
    );
};

export default FacialLandmarks;
