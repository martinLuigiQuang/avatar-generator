import * as React from 'react';
import * as facemesh from '@tensorflow-models/facemesh';
import Utils from '../utils';
import AvatarButtons from './AvatarButtons';
import * as Hairs from '../data/hairs';
import * as Masks from '../data/masks';
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
    zIndex: 90,
    width: 480,
    height: 480
};

const GENDER = 'female';

const FacialLandmarks = (props) => {
    const [ isLoading, setIsLoading ] = React.useState(true);
    const [ faceWidth, setFaceWidth ] = React.useState(0);
    const [ faceHeight, setFaceHeight ] = React.useState(0);
    const [ headTiltAngle, setHeadTiltAngle ] = React.useState(0);
    const [ topOfHead, setTopOfHead ] = React.useState([0, 0]);
    const [ chin, setChin ] = React.useState([0, 0]);
    const [ leftEyebrow, setLeftEyebrow ] = React.useState([0, 0]);
    const [ isHeadTiltTooLarge, setIsHeadTiltTooLarge ] = React.useState(false);
    const [ isPhotoUploaded, setIsPhotoUploaded ] = React.useState(false);

    const [ hairIndex, setHairIndex ] = React.useState(0);
    const [ maskIndex, setMaskIndex ] = React.useState(0);

    const avatarRef = React.useRef(null);
    const photoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const hairRef = React.useRef(null);
    const maskRef = React.useRef(null);

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
        const faceInformation = UTILS.crop(face, ctx, ctxWidth);
        if (faceInformation) {
            const [height, faceWidth, headTiltAngle, topOfHead, chin, leftEyebrow] = faceInformation;
            const isHeadTiltAcceptable = UTILS.checkHeadTiltAngle(headTiltAngle);
            setIsHeadTiltTooLarge(!isHeadTiltAcceptable);
            if (isHeadTiltAcceptable) {
                setFaceHeight(height);
                setFaceWidth(faceWidth);
                setTopOfHead(topOfHead);
                setLeftEyebrow(leftEyebrow);
                setChin(chin);
                setHeadTiltAngle(headTiltAngle);
            }
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
                <div ref={avatarRef} className={`photo-container ${isLoading || isHeadTiltTooLarge ? 'loading' : ''}`} style={{width: 480}}>
                    <div className="image-container">
                        <img ref={photoRef} src="#" style={IMAGE_STYLE} alt="user-profile" />
                    </div>
                    <canvas
                        ref={canvasRef}
                        style={IMAGE_STYLE}
                        className={`${isLoading || isHeadTiltTooLarge? 'hidden' : ''}`}
                    />
                    <img 
                        ref={hairRef}
                        src={Hairs.getHair(hairIndex, GENDER)} 
                        alt="hair-option" 
                        id="hair-option"
                        className="hair-option" 
                        style={Hairs.getHairStyles(faceWidth, topOfHead, headTiltAngle, [0,0], isLoading)}
                    />
                    <img 
                        ref={maskRef}
                        src={Masks.getMask(maskIndex, GENDER)} 
                        alt="mask-option" 
                        id="mask-option"
                        className="mask-option" 
                        style={Masks.getMaskStyles(faceWidth, topOfHead, leftEyebrow, headTiltAngle, isLoading)}
                    />
                </div>
                {isHeadTiltTooLarge ? renderWarning() : null}
                <div className="upload-button">
                    <input type="file" onChange={handleImageUpload}/>
                </div>
                <AvatarButtons 
                    value={hairIndex} 
                    handleClick={(e) => setHairIndex(Hairs.getHairIndex(e.target.value, GENDER, hairIndex))}
                />
                <AvatarButtons 
                    value={maskIndex} 
                    handleClick={(e) => setMaskIndex(Masks.getMaskIndex(e.target.value, GENDER, maskIndex))}
                />
            </div>
        </div>
    );
};

export default FacialLandmarks;
