import * as React from 'react';
import * as tf from '@tensorflow/tfjs';
import * as Facemesh from '@tensorflow-models/facemesh';
import Utils from '../utils';
import { AvatarOptions, ScaledUploadedPhoto, AvatarAccessoryDisplay, Warning } from './FacialLandmarksHelper';
import Button from '@material-ui/core/Button';
import * as Hairs from '../data/hairs';
import * as Masks from '../data/masks';
import * as Bodies from '../data/bodies';
import * as Tops from '../data/tops';
import * as Bottoms from '../data/bottoms';
import * as Footwares from '../data/footwares';
import * as Gloves from '../data/gloves';
import * as Capes from '../data/capes';
import * as Swords from '../data/swords';
import * as Shields from '../data/shields';
import ApplicationConstants from '../data/constants';
import './FacialLandmarks.scss';

const UTILS = new Utils();
const IMAGE_STYLE = ApplicationConstants.IMAGE_STYLE;
const GENDER = Object.keys(ApplicationConstants.GENDER);

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
    const [ windowInnerWidth, setWindowInnerWidth ] = React.useState(1200);
    const [ isSelectionPanelOpen, setIsSelectionPanelOpen ] = React.useState(true);

    const [ genderIndex, setGenderIndex ] = React.useState(0)
    const [ hairIndex, setHairIndex ] = React.useState(0);
    const [ maskIndex, setMaskIndex ] = React.useState(0);
    const [ bodyIndex, setBodyIndex ] = React.useState(0);
    const [ topIndex, setTopIndex ] = React.useState(0);
    const [ bottomIndex, setBottomIndex ] = React.useState(0);
    const [ footwareIndex, setFootwareIndex ] = React.useState(0);
    const [ gloveIndex, setGloveIndex ] = React.useState(0);
    const [ capeIndex, setCapeIndex ] = React.useState(0);
    const [ swordIndex, setSwordIndex ] = React.useState(0);
    const [ shieldIndex, setShieldIndex ] = React.useState(0);

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
    const capeRef = React.createRef(null);
    const swordRef = React.createRef(null);
    const shieldRef = React.createRef(null);

    React.useEffect(
        () => {
            if (isPhotoUploaded) {
                runFacemesh();
            };
        },
        [isFirstPass, isPhotoUploaded]
    );

    React.useEffect(
        () => {
            resizeWindow();
            window.addEventListener('resize', resizeWindow);
        },
        []
    );

    const APPEARANCE_OPTIONS = {
        'gender': { index: genderIndex, setIndex: setGenderIndex },
        'hair': { assets: Hairs, index: hairIndex, setIndex: setHairIndex, ref: hairRef },
        'body': { assets: Bodies, index: bodyIndex, setIndex: setBodyIndex, ref: bodyRef },
    };

    const AVATAR_ACCESSORIES = {
        'mask / headwear': { assets: Masks, index: maskIndex, setIndex: setMaskIndex, ref: maskRef },
        'top': { assets: Tops, index: topIndex, setIndex: setTopIndex, ref: topRef },
        'cape': { assets: Capes, index: capeIndex, setIndex: setCapeIndex, ref: capeRef },
        'bottom': { assets: Bottoms, index: bottomIndex, setIndex: setBottomIndex, ref: bottomRef },
        'footwear': { assets: Footwares, index: footwareIndex, setIndex: setFootwareIndex, ref: footwareRef},
        'glove': { assets: Gloves, index: gloveIndex, setIndex: setGloveIndex, ref: gloveRef },
        'shield': { assets: Shields, index: shieldIndex, setIndex: setShieldIndex, ref: shieldRef },
        'sword': { assets: Swords, index: swordIndex, setIndex: setSwordIndex, ref: swordRef },
    };

    const resizeWindow = () => {
        setWindowInnerWidth(window.innerWidth);
        setIsSelectionPanelOpen(window.innerWidth > 1100)
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
            {isLoading && isPhotoUploaded ? 'Scanning face...' : 'Upload/Take your photo'}
        </Button>
    );

    const SelectPanel = (
        <div className={`avatar-options-selection-panel ${windowInnerWidth <= 1100 && !isSelectionPanelOpen ? 'collapsed' : ''}`}>
            {
                windowInnerWidth <= 1100 && isSelectionPanelOpen ?
                    <Button className="close-selection-panel-button" onClick={() => setIsSelectionPanelOpen(false)}>
                        close
                    </Button> :
                    null
            }
            <AvatarOptions
                options={APPEARANCE_OPTIONS}
                title="appearance-options"
                gender={GENDER[genderIndex]}
                isDisabled={!isPhotoUploaded || isLoading}
                bodyIndex={bodyIndex}
            />
            <AvatarOptions
                options={AVATAR_ACCESSORIES}
                title="avatar-accessories"
                gender={GENDER[genderIndex]}
                isDisabled={!isPhotoUploaded || isLoading}
                bodyIndex={bodyIndex}
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

    const OpenSelectionPanelButton = (
        <Button
            className="open-selection-panel-button"
            onClick={() => setIsSelectionPanelOpen(true)}
        >
            {'>'} Avatar Options
        </Button>
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
                style={{ 
                    ...IMAGE_STYLE, 
                    width: 'auto',
                    marginLeft: UTILS.getPhotoMargin(scalingRatio),
                    marginRight: UTILS.getPhotoMargin(scalingRatio), 
                    top: -topOfHead[1] + ApplicationConstants.AVATAR_TOP_POSITION 
                }}
                className={`${isLoading || isHeadTiltTooLarge ? 'hidden' : ''}`}
            />
            <AvatarAccessoryDisplay 
                optionsArray={[APPEARANCE_OPTIONS, AVATAR_ACCESSORIES]}
                gender={GENDER[genderIndex]}
                parentStates={{faceWidth, topOfHead, isLoading, headTiltAngle, scalingRatio, chin, leftEyebrow, bodyIndex}}
            />
        </div>
    );

    return (
        <>
            <div className="avatar-generator-container">
                {UploadButton}
                <div className="avatar-generator">
                    {isSelectionPanelOpen ? SelectPanel : OpenSelectionPanelButton}
                    {isHeadTiltTooLarge ? <Warning /> : PhotoContainer}
                </div>
            </div>
            <Button onClick={UTILS.print} className="print-button">Print</Button>
        </>
    );
};

export default FacialLandmarks;
