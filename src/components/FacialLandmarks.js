import * as React from 'react';
import * as tf from '@tensorflow/tfjs';
import * as Facemesh from '@tensorflow-models/facemesh';
import Utils from '../utils';
import AvatarButtons from './AvatarButtons';
import Button from '@material-ui/core/Button';
import * as Hairs from '../data/hairs';
import * as Masks from '../data/masks';
import * as Bodies from '../data/bodies';
import * as Tops from '../data/tops';
import * as Bottoms from '../data/bottoms';
import * as Footwares from '../data/footwares';
import * as Gloves from '../data/gloves';
import * as Accessories from '../data/accessories';
import ApplicationConstants from '../data/constants';
import './FacialLandmarks.scss';

const UTILS = new Utils();
const IMAGE_STYLE = ApplicationConstants.IMAGE_STYLE;
const GENDER = ['genderNeutral', 'female', 'male'];

export const OptionsButton = (props) => {
    const { index, handleClick, name } = props;
    return (
        <div className="option-button-container">
            <p>{name}</p>
            <AvatarButtons value={index} handleClick={handleClick} />
        </div>
    );
};

export const AvatarOptions = (props) => {
    const { options, title, gender } = props;
    return (
        <div className={`avatar-options-container`} id={title}>
            <h2>{title.split('-').join(' ')}</h2>
            {
                Object.keys(options).map(key => {
                    const item = options[key];
                    const handleClick = (e) => {
                        const change = e.target.innerText === ApplicationConstants.INCREASE_INDEX ? 1 : -1;
                        let newIndex;
                        if (key === 'gender') {
                            switch (item.index + change) {
                                case -1: 
                                    newIndex = 2;
                                    break;
                                case 3:
                                    newIndex = 0
                                    break;
                                default:
                                    newIndex = item.index + change; 
                            }
                        } else {
                            newIndex = item.assets.changeIndex(change, gender, item.index);
                        }
                        item.setIndex(newIndex);
                    };
                    return (
                        <OptionsButton
                            key={key}
                            name={key}
                            index={key === 'gender' ? GENDER[item.index] : item.index}
                            handleClick={handleClick}
                        />
                    );
                })
            }
        </div>
    );
};

export const AvatarAccessory = React.forwardRef((props, ref) => {
    const { title, src, style } = props;
    return <img ref={ref} src={src} id={title} alt={title} className={title} style={style} />;
});

export const ScaledUploadedPhoto = React.forwardRef((props, ref) => {
    const { src, style } = props;
    const title = "scaled-uploaded-photo";
    return <img ref={ref} src={src} id={title} alt={title} style={style} />;
});

export const Warning = () => {
    return (
        <div className="warning-container">
            <h2>Your face is tilted. Please upload a different photo.</h2>
        </div>
    );
};

const FacialLandmarks = (props) => {
    const [ scalingRatio, setScalingRatio ] = React.useState(1);
    const [ isLoading, setIsLoading ] = React.useState(true);
    const [ faceWidth, setFaceWidth ] = React.useState(0);
    const [ headTiltAngle, setHeadTiltAngle ] = React.useState(0);
    const [ topOfHead, setTopOfHead ] = React.useState([0, 0]);
    const [ chin, setChin ] = React.useState([0, 0]);
    const [ leftEyebrow, setLeftEyebrow ] = React.useState([0, 0]);
    const [ isHeadTiltTooLarge, setIsHeadTiltTooLarge ] = React.useState(false);
    const [ isPhotoUploaded, setIsPhotoUploaded ] = React.useState(false);
    const [ isFirstPass, setIsFirstPass ] = React.useState(true);

    const [ genderIndex, setGenderIndex ] = React.useState(0)
    const [ hairIndex, setHairIndex ] = React.useState(0);
    const [ maskIndex, setMaskIndex ] = React.useState(0);
    const [ bodyIndex, setBodyIndex ] = React.useState(0);
    const [ topIndex, setTopIndex ] = React.useState(0);
    const [ bottomIndex, setBottomIndex ] = React.useState(0);
    const [ footwareIndex, setFootwareIndex ] = React.useState(0);
    const [ gloveIndex, setGloveIndex ] = React.useState(0);
    const [ accessoryIndex, setAccessoryIndex ] = React.useState(0);

    const avatarRef = React.useRef(null);
    const photoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const scaledPhotoRef = React.useRef(null);
    const fileUploadRef = React.useRef(null);
    const hairRef = React.createRef(null);
    const maskRef = React.createRef(null);
    const bodyRef = React.createRef(null);
    const topRef = React.createRef(null);
    const bottomRef = React.createRef(null);
    const footwareRef = React.createRef(null);
    const gloveRef = React.createRef(null);
    const accessoryRef = React.createRef(null);

    React.useEffect(
        () => {
            if (isPhotoUploaded) {
                runFacemesh();
            };
        },
        [isFirstPass, isPhotoUploaded]
    );

    const AVATAR_ACCESSORIES = {
        'mask / headware': { assets: Masks, index: maskIndex, setIndex: setMaskIndex, ref: maskRef },
        'top': { assets: Tops, index: topIndex, setIndex: setTopIndex, ref: topRef },
        'bottom': { assets: Bottoms, index: bottomIndex, setIndex: setBottomIndex, ref: bottomRef },
        'glove': { assets: Gloves, index: gloveIndex, setIndex: setGloveIndex, ref: gloveRef },
        'accessory': { assets: Accessories, index: accessoryIndex, setIndex: setAccessoryIndex, ref: accessoryRef },
        'footware': { assets: Footwares, index: footwareIndex, setIndex: setFootwareIndex, ref: footwareRef},
    };

    const APPEARANCE_OPTIONS = {
        'gender': { index: genderIndex, setIndex: setGenderIndex },
        'hair': { assets: Hairs, index: hairIndex, setIndex: setHairIndex, ref: hairRef },
        'body': { assets: Bodies, index: bodyIndex, setIndex: setBodyIndex, ref: bodyRef },
    };

    const runFacemesh = async () => {
        const photo = isFirstPass ? photoRef.current : scaledPhotoRef.current;
        const canvas = canvasRef.current;
        canvas.width = scalingRatio * IMAGE_STYLE.width;
        canvas.height = photo.height;
        const mesh = await Facemesh.load({
            inputResolution: { width: scalingRatio * IMAGE_STYLE.width, height: photo.height },
            scale: ApplicationConstants.FACEMESH_SCALE
        });
        const face = await mesh.estimateFaces(photo);
        if (isFirstPass) {
            const { faceWidth } = UTILS.getFaceWidth(face);
            const ratio = ApplicationConstants.AVATAR_FACE_WIDTH / faceWidth;
            setScalingRatio(ratio);
            setIsFirstPass(false);
        } else {
            const ctx = await canvas.getContext('2d');
            ctx.drawImage(photo, 0, 0, scalingRatio * IMAGE_STYLE.width, photo.height);
            const faceInformation = await UTILS.crop(face, ctx, scalingRatio * IMAGE_STYLE.width, photo.height);
            const imageData = ctx.getImageData(0, 0, scalingRatio * IMAGE_STYLE.width, photo.height);
            UTILS.turnPixelTransparent(imageData);
            ctx.putImageData(imageData, 0, 0);
            if (faceInformation) {
                setFaceGeometry(faceInformation);
            }
        }
    };

    const setFaceGeometry = (faceInformation) => {
        const { headTiltAngle, topOfHead, chin, leftEyebrow } = faceInformation;
        const isHeadTiltAcceptable = UTILS.checkHeadTiltAngle(headTiltAngle);
        setIsHeadTiltTooLarge(!isHeadTiltAcceptable);
        if (isHeadTiltAcceptable) {
            setIsLoading(false);
            setFaceWidth(ApplicationConstants.AVATAR_FACE_WIDTH);
            setTopOfHead(topOfHead);
            setLeftEyebrow(leftEyebrow);
            setChin(chin);
            setHeadTiltAngle(headTiltAngle);
        }
    };

    const checkPhotoUpload = () => {
        if (!isPhotoUploaded) {
            setIsPhotoUploaded(true);
        }
        if (!isLoading) {
            setIsLoading(true);
        }
        if (!isFirstPass) {
            setIsFirstPass(true);
        }
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            checkPhotoUpload();
            photoRef.current.onload = () => URL.revokeObjectURL(photoRef.current.src);
            scaledPhotoRef.current.onload = () => URL.revokeObjectURL(scaledPhotoRef.current.src);
            const uploadedFile = URL.createObjectURL(files[0]);
            photoRef.current.src = uploadedFile;
            scaledPhotoRef.current.src = uploadedFile;
        }
    };

    const UploadButton = (
        <Button
            className="upload-button"
            onClick={() => fileUploadRef.current.click()}
        >
            <input
                ref={fileUploadRef}
                type="file"
                onChange={handleImageUpload}
            />
            {isLoading && isPhotoUploaded ? 'Scanning face...' : 'Photo Upload'}
        </Button>
    );

    const SelectPanel = (
        <div className="avatar-options-selection-panel">
            <AvatarOptions
                options={APPEARANCE_OPTIONS}
                title="appearance-options"
                gender={GENDER[genderIndex]}
            />
            <AvatarOptions
                options={AVATAR_ACCESSORIES}
                title="avatar-accessories"
                gender={GENDER[genderIndex]}
            />
        </div>
    );

    const UploadedImageContainer = (
        <div className={`image-container ${!isPhotoUploaded ? 'hidden' : ''}`}>
            <img
                ref={photoRef}
                src="#"
                style={{
                    ...IMAGE_STYLE,
                    opacity: isLoading ? 1 : 0
                }}
                id="uploaded-photo"
                alt='user-profile'
            />
            <ScaledUploadedPhoto
                ref={scaledPhotoRef}
                src="#"
                style={{
                    ...IMAGE_STYLE,
                    width: scalingRatio * IMAGE_STYLE.width
                }}
            />
        </div>
    );

    const PhotoContainer = (
        < div
            ref={avatarRef}
            style={{ width: 400 }}
            className={`photo-container ${isLoading || isHeadTiltTooLarge ? 'loading' : ''}`}
        >
            {UploadedImageContainer}
            <canvas
                ref={canvasRef}
                style={{ ...IMAGE_STYLE, width: 'auto' }}
                className={`${isLoading || isHeadTiltTooLarge ? 'hidden' : ''}`}
            />
            {
                Object.keys({ ...APPEARANCE_OPTIONS, ...AVATAR_ACCESSORIES }).map(key => {
                    if (key === 'gender') {
                        return null;
                    }
                    const item = { ...APPEARANCE_OPTIONS, ...AVATAR_ACCESSORIES }[key];
                    const isBehindBody = key === 'accessory' && accessoryIndex < 2;
                    const isInFrontOfHair = key === 'accessory' && accessoryIndex === 2;
                    const style = item.assets.getStyles(
                        faceWidth,
                        topOfHead,
                        isLoading,
                        { scalingRatio, headTiltAngle, chin, leftEyebrow, isBehindBody, isInFrontOfHair }
                    );
                    return (
                        <AvatarAccessory
                            key={key}
                            title={`${key} accessory-option`}
                            src={item.assets.getItem(item.index, GENDER[genderIndex])}
                            ref={item.ref}
                            style={style}
                        />
                    );
                })
            }
        </div>
    );

    return (
        <div className="avatar-generator-container">
            {UploadButton}
            <div className="avatar-generator">
                {SelectPanel}
                {isHeadTiltTooLarge ? <Warning /> : PhotoContainer}
            </div>
        </div>
    );
};

export default FacialLandmarks;
