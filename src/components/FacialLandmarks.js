import * as React from 'react';
import * as facemesh from '@tensorflow-models/facemesh';
import Utils from '../utils';
import AvatarButtons from './AvatarButtons';
import * as Hairs from '../data/hairs';
import * as Masks from '../data/masks';
import * as Bodies from '../data/bodies';
import * as Tops from '../data/tops';
import * as Accessories from '../data/accessories';
import * as tf from '@tensorflow/tfjs';
import './FacialLandmarks.scss';
import ApplicationConstants from '../data/constants';

const UTILS = new Utils();
const IMAGE_STYLE = ApplicationConstants.IMAGE_STYLE;

const GENDER = 'female';

const runFacemesh = async (detectFace) => {
    const mesh = await facemesh.load({
        inputResolution: { width: 400, height: 400 },
        scale: 1
    });
    detectFace(mesh);
};

export const OptionsButton = (props) => {
    const { index, handleClick } = props;
    return <AvatarButtons value={index} handleClick={handleClick} />;
};

export const AvatarAccessory = React.forwardRef((props, ref) => {
    const { title, src, style } = props;
    return <img ref={ref} src={src} id={title} alt={title} className={title} style={style} />;
});

export const Warning = () => {
    return (
        <div className="warning-container">
            <h2>Your face is tilted. Please upload a different photo.</h2>
        </div>
    );
};

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
    const [ bodyIndex, setBodyIndex ] = React.useState(0);
    const [ topIndex, setTopIndex ] = React.useState(0);
    const [ accessoryIndex, setAccessoryIndex ] = React.useState(0);

    const avatarRef = React.useRef(null);
    const photoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const hairRef = React.createRef(null);
    const maskRef = React.createRef(null);
    const bodyRef = React.createRef(null);
    const topRef = React.createRef(null);
    const accessoryRef = React.createRef(null);

    const AVATAR_ACCESSORIES = {
        hair: { assets: Hairs, index: hairIndex, setIndex: setHairIndex, ref: hairRef },
        mask: { assets: Masks, index: maskIndex, setIndex: setMaskIndex, ref: maskRef },
        body: { assets: Bodies, index: bodyIndex, setIndex: setBodyIndex, ref: bodyRef },
        top: { assets: Tops, index: topIndex, setIndex: setTopIndex, ref: topRef },
        accessory: { assets: Accessories, index: accessoryIndex, setIndex: setAccessoryIndex, ref: accessoryRef }
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

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            setIsPhotoUploaded(true);
            runFacemesh(detectFace);
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
                {isHeadTiltTooLarge ? <Warning /> : null}
                <div className="upload-button">
                    <input type="file" onChange={handleImageUpload} />
                </div>
                {
                    Object.keys(AVATAR_ACCESSORIES).map(accessory => {
                        const item = AVATAR_ACCESSORIES[accessory];
                        const handleClick = (e) => {
                            const newIndex = item.assets.changeIndex(e.target.value, GENDER, item.index);
                            item.setIndex(newIndex);
                        };
                        return <OptionsButton key={accessory} index={item.index.get} handleClick={handleClick}/>
                    })
                }
                <div ref={avatarRef} className={`photo-container ${isLoading || isHeadTiltTooLarge ? 'loading' : ''}`} style={{width: 400}}>
                    <div className="image-container">
                        <img ref={photoRef} src="#" style={IMAGE_STYLE} alt="user-profile" />
                    </div>
                    <canvas
                        ref={canvasRef}
                        style={IMAGE_STYLE}
                        className={`${isLoading || isHeadTiltTooLarge? 'hidden' : ''}`}
                    />
                    {
                        Object.keys(AVATAR_ACCESSORIES).map(accessory => {
                            const item = AVATAR_ACCESSORIES[accessory];
                            const isBehindBody = accessory === 'accessory';
                            let style;
                            if (!item.assets.getStyles) {
                                style = Bodies.getStyles(faceWidth, topOfHead, [0, 0], isLoading, { headTiltAngle, chin, isBehindBody });
                            } else {
                                style = item.assets.getStyles(faceWidth, topOfHead, [0, 0], isLoading, { headTiltAngle, chin, leftEyebrow });
                            }
                            return (
                                <AvatarAccessory 
                                    key={accessory}
                                    title={`${accessory} accessory-option`}
                                    src={item.assets.getItem(item.index, GENDER)}
                                    ref={item.ref}
                                    style={style}
                                />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default FacialLandmarks;
