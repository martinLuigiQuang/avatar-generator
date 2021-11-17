import * as React from 'react';
import * as tf from '@tensorflow/tfjs';
import * as HtmlToImage from 'html-to-image';
import * as Facemesh from '@tensorflow-models/facemesh';
import Utils from '../utils';
import Button from '@material-ui/core/Button';
import * as Hairs from '../data/hairs';
import * as Masks from '../data/masks';
import * as Bodies from '../data/bodies';
import * as Tops from '../data/tops';
import * as Bottoms from '../data/bottoms';
import * as Footwears from '../data/footwares';
import * as Gloves from '../data/gloves';
import * as Capes from '../data/capes';
import * as Swords from '../data/tools';
import * as Shields from '../data/shields';
import ApplicationConstants from '../data/constants';
import { 
    AvatarOptions, 
    ScaledUploadedPhoto, 
    AvatarAccessoryDisplay,
    SetCostumesOptions, 
    Warning, 
    Instruction,
    PanelButton
} from './FacialLandmarksHelper';
import Locales from '../data/locales.json';
import './FacialLandmarks.scss';

const download = require('downloadjs');
const UTILS = new Utils();
const IMAGE_STYLE = ApplicationConstants.IMAGE_STYLE;
const GENDER = Object.keys(ApplicationConstants.GENDER);

const FacialLandmarks = (props) => {
    const { language, pngImage, isImageDownloaded, handleCreateImage, handleDownload } = props;

    const [ isLoading, setIsLoading ] = React.useState(true);
    const [ isFirstPass, setIsFirstPass ] = React.useState(true);
    const [ isPhotoUploaded, setIsPhotoUploaded ] = React.useState(false);
    const [ windowInnerWidth, setWindowInnerWidth ] = React.useState(1200);
    const [ faceDetectionErrorCode, setFaceDetectionErrorCode ] = React.useState(null);
    const [ isSelectionPanelOpen, setIsSelectionPanelOpen ] = React.useState(true);
    const [ isSetCostumesPanelOpen, setIsSetCostumesPanelOpen ] = React.useState(true);
    const [ isInPreviewMode, setIsInPreviewMode ] = React.useState(false);
    const [ downloadImage, setDownloadImage ] = React.useState(null);
    const [ isDownloadButtonClicked, setIsDownloadButtonClicked ] = React.useState(false);
    
    const [ scalingRatio, setScalingRatio ] = React.useState(1);
    const [ faceWidth, setFaceWidth ] = React.useState(0);
    const [ headTiltAngle, setHeadTiltAngle ] = React.useState(0);
    const [ topOfHead, setTopOfHead ] = React.useState([0, 0]);
    const [ chin, setChin ] = React.useState([0, 0]);
    const [ leftEyebrow, setLeftEyebrow ] = React.useState([0, 0]);
    const [ bodyGender, setBodyGender ] = React.useState('female');
    
    const [ genderIndex, setGenderIndex ] = React.useState(0)
    const [ hairIndex, setHairIndex ] = React.useState(0);
    const [ maskIndex, setMaskIndex ] = React.useState(0);
    const [ bodyIndex, setBodyIndex ] = React.useState(0);
    const [ topIndex, setTopIndex ] = React.useState(0);
    const [ bottomIndex, setBottomIndex ] = React.useState(0);
    const [ footwearIndex, setFootwearIndex ] = React.useState(0);
    const [ glovesIndex, setGlovesIndex ] = React.useState(0);
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
    const footwearRef = React.createRef(null);
    const glovesRef = React.createRef(null);
    const capeRef = React.createRef(null);
    const swordRef = React.createRef(null);
    const shieldRef = React.createRef(null);

    React.useEffect(
        () => {
            if (downloadImage && isDownloadButtonClicked) {
                const link = document.createElement('a');
                link.href = downloadImage;
                link.setAttribute('download', 'avatar.jpeg');
                document.body.appendChild(link);
                setDownloadImage(null);
                setIsDownloadButtonClicked(false);
                link.click();
            }
        },
        [downloadImage, isDownloadButtonClicked]
    );

    React.useEffect(
        () => {
            resizeWindow();
            window.addEventListener('resize', resizeWindow);
        },
        []
    );

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
            if (GENDER[genderIndex] === 'genderNeutral') {
                const gender = UTILS.isOddNumber(bodyIndex) ? ApplicationConstants.GENDER.male : ApplicationConstants.GENDER.female;
                setBodyGender(gender);
            } else {
                setBodyGender(ApplicationConstants.GENDER[GENDER[genderIndex]]);
            }
        },
        [genderIndex, bodyIndex]
    );

    const AVATAR_APPEARANCE = {
        'gender': { index: genderIndex, setIndex: setGenderIndex },
        'hair': { assets: Hairs, index: hairIndex, setIndex: setHairIndex, ref: hairRef },
        'body': { assets: Bodies, index: bodyIndex, setIndex: setBodyIndex, ref: bodyRef },
    };

    const AVATAR_OUTFITS = {
        'mask / headwear': { assets: Masks, index: maskIndex, setIndex: setMaskIndex, ref: maskRef },
        'top': { assets: Tops, index: topIndex, setIndex: setTopIndex, ref: topRef },
        'bottom': { assets: Bottoms, index: bottomIndex, setIndex: setBottomIndex, ref: bottomRef },
        'footwear': { assets: Footwears, index: footwearIndex, setIndex: setFootwearIndex, ref: footwearRef},
        'gloves': { assets: Gloves, index: glovesIndex, setIndex: setGlovesIndex, ref: glovesRef },
    };

    const AVATAR_ACCESSORIES = {
        'cape': { assets: Capes, index: capeIndex, setIndex: setCapeIndex, ref: capeRef },
        'shield': { assets: Shields, index: shieldIndex, setIndex: setShieldIndex, ref: shieldRef },
        'tools': { assets: Swords, index: swordIndex, setIndex: setSwordIndex, ref: swordRef }
    };

    const handleSetCostumesIndex = (index) => {
        if (index === 0) {
            setHairIndex(0);
            setCapeIndex(0);
            setShieldIndex(0);
            setSwordIndex(0);
        }
        setMaskIndex(UTILS.getCostumeIndex(Masks.getNumOfAssets(bodyGender), maskIndex, false, index));
        setTopIndex(UTILS.getCostumeIndex(Tops.getNumOfAssets(bodyGender), topIndex, false, index));
        setGlovesIndex(UTILS.getCostumeIndex(Gloves.getNumOfAssets(bodyGender), glovesIndex, false, index));
        setBottomIndex(UTILS.getCostumeIndex(Bottoms.getNumOfAssets(bodyGender), bottomIndex, false, index));
        setFootwearIndex(UTILS.getCostumeIndex(Footwears.getNumOfAssets(bodyGender), footwearIndex, false, index));
    };

    const handleSetRandomAppearance = () => {
       setHairIndex(UTILS.getCostumeIndex(Hairs.getNumOfAssets(bodyGender), hairIndex, true));
    };

    const handleSetRandomAccessories = () => {
        setCapeIndex(UTILS.getCostumeIndex(Capes.getNumOfAssets(bodyGender), capeIndex, true));
        setShieldIndex(UTILS.getCostumeIndex(Shields.getNumOfAssets(bodyGender), shieldIndex, true));
        setSwordIndex(UTILS.getCostumeIndex(Swords.getNumOfAssets(bodyGender), swordIndex, true));
    };

    const OPTIONS = {
        'avatar_appearance': { categories: AVATAR_APPEARANCE, getRandomAssets: handleSetRandomAppearance },
        'avatar_outfits': { categories: AVATAR_OUTFITS, getRandomAssets: handleSetCostumesIndex },
        'avatar_accessories': { categories: AVATAR_ACCESSORIES, getRandomAssets: handleSetRandomAccessories }
    };

    const SET_COSTUMES = {
        'blank': 0,
        'blue': 1,
        'green': 2,
        'magenta': 3,
        'purple': 3,
        'orange': 4,
        'red': 5,
        'yellow': 6
    };

    const resizeWindow = () => {
        setWindowInnerWidth(window.innerWidth);
        if (window.innerWidth <= 1100) {
            setIsSelectionPanelOpen(false);
            setIsSetCostumesPanelOpen(false);
        }
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
            if (faceInformation && !faceInformation.status && !Number.isNaN(scalingRatio)) {
                const imageData = ctx.getImageData(0, 0, scalingRatio * IMAGE_STYLE.width, photo.height);
                UTILS.turnPixelTransparent(imageData);
                ctx.putImageData(imageData, 0, 0);
                setFaceGeometry(faceInformation);
            } else {
                setFaceDetectionErrorCode('noFaceDetected');
                setIsLoading(false);
            }
        }
    };

    const setFaceGeometry = (faceInformation) => {
        const { headTiltAngle, topOfHead, chin, leftEyebrow } = faceInformation;
        const isHeadTiltAcceptable = UTILS.checkHeadTiltAngle(headTiltAngle);
        setIsLoading(false);
        if (isHeadTiltAcceptable) {
            setFaceWidth(ApplicationConstants.AVATAR_FACE_WIDTH);
            setTopOfHead(topOfHead);
            setLeftEyebrow(leftEyebrow);
            setChin(chin);
            setHeadTiltAngle(headTiltAngle);
        } else {
            setFaceDetectionErrorCode('headTiltTooLarge');
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

    const handleUploadButtonClick = () => {
        if (faceDetectionErrorCode) {
            setFaceDetectionErrorCode(null);
            setIsPhotoUploaded(false);
        }
        fileUploadRef.current.click()
    };

    const handleOpenPanel = (setThisPanelOpen, isOtherPanelOpen, setOtherPanelOpen) => {
        setThisPanelOpen(true);
        if (windowInnerWidth <= 600 && isOtherPanelOpen) {
            setOtherPanelOpen(false);
        }
    };

    const SelectPanel = (
        <div className={`avatar-options-selection-panel ${!isSelectionPanelOpen ? 'collapsed' : ''} ${isInPreviewMode ? 'preview' : ''}`}>
            <PanelButton 
                className="close-selection-panel-button"
                text={Locales[language]["CLOSE"]}
                handleClick={() => setIsSelectionPanelOpen(false)}
            />
            {
                Object.keys(OPTIONS).map(key => {
                    return (
                        <AvatarOptions 
                            key={key}
                            title={key}
                            options={OPTIONS[key].categories}
                            gender={GENDER[genderIndex]}
                            bodyGender={bodyGender}
                            isDisabled={!isPhotoUploaded || isLoading}
                            language={language}
                        />
                    );
                })
            }
        </div>
    );

    const SetCostumes = (
        <div className={`set-costumes-options-panel ${!isSetCostumesPanelOpen ? 'collapsed' : ''} ${isInPreviewMode ? 'preview' : ''}`}>
            <PanelButton
                className="close-set-costumes-panel-button"
                text={Locales[language]['CLOSE']}
                handleClick={() => setIsSetCostumesPanelOpen(false)}
            />
            <h2>{Locales[language]['SET OUTFITS']}</h2>
            {
                Object.keys(SET_COSTUMES)
                .filter(costumeColor => {
                    if (bodyGender === ApplicationConstants.GENDER.male) {
                        return costumeColor !== 'magenta';
                    }
                    return costumeColor !== 'purple';
                })
                .map(costumeColor => {
                    const index = SET_COSTUMES[costumeColor];
                    return (
                        <SetCostumesOptions
                            key={costumeColor}
                            color={costumeColor}
                            disabled={isLoading || !isPhotoUploaded}
                            handleClick={() => handleSetCostumesIndex(index)}
                        />
                    );
                })
            }
            <h2>{Locales[language]['RANDOM SECTION']}</h2>
            {
                Object.keys(OPTIONS).map(key => {
                    const optionName = key.split('_')[1];
                    const text = Locales[language]['RANDOM'].concat(' ').concat(optionName === 'appearance' ? 'hair' : optionName);
                    return (
                        <Button
                            key={key}
                            className="random-generator-button"
                            disabled={isLoading || !isPhotoUploaded || faceDetectionErrorCode}
                            onClick={() => OPTIONS[key].getRandomAssets()}
                        >
                            {text}
                        </Button>
                    );
                })
            }
        </div>
    );

    const OpenSelectionPanelButton = (
        <PanelButton 
            className={`open-selection-panel-button ${isInPreviewMode ? 'preview' : ''}`}
            text={`> ${Locales[language]["AVATAR OPTIONS"]}`}
            handleClick={() => handleOpenPanel(setIsSelectionPanelOpen, isSetCostumesPanelOpen, setIsSetCostumesPanelOpen)}
        />
    );

    const OpenSetCostumesPanelButton = (
        <PanelButton
            className={`open-set-costumes-panel-button ${isInPreviewMode ? 'preview' : ''}`}
            text={`${Locales[language]['SET OUTFITS']} <`}
            handleClick={() => handleOpenPanel(setIsSetCostumesPanelOpen, isSelectionPanelOpen, setIsSelectionPanelOpen)}
        />
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
            className={`photo-container ${isLoading ? 'loading' : ''} ${faceDetectionErrorCode || !isPhotoUploaded ? 'hidden' : ''} ${isInPreviewMode ? 'previewImage' : ''}`}
        >
            {UploadedImageContainer}
            <canvas
                ref={canvasRef}
                style={{ 
                    ...IMAGE_STYLE, 
                    width: 'auto',
                    marginLeft: UTILS.getPhotoMargin(scalingRatio),
                    marginRight: UTILS.getPhotoMargin(scalingRatio),
                    left: - chin[0] + 0.5 * scalingRatio * IMAGE_STYLE.width, 
                    top: - topOfHead[1] + ApplicationConstants.AVATAR_TOP_POSITION 
                }}
                className={`${isLoading ? 'hidden' : ''}`}
            />
            <AvatarAccessoryDisplay 
                optionsArray={Object.keys(OPTIONS).map(key => OPTIONS[key].categories)}
                gender={GENDER[genderIndex]}
                parentStates={{faceWidth, topOfHead, isLoading, headTiltAngle, scalingRatio, chin, leftEyebrow, bodyGender}}
            />
        </div>
    );

    const getDownloadImageSize = (dataUrl) => {
        return atob(dataUrl.split('base64,')[1]).length / 1000;
    };

    const handleDownloadButtonClick = () => {
        getJpegImage(1);
        setIsDownloadButtonClicked(true);
    };

    const getJpegImage = (numOfTrials) => {
        if (!isDownloadButtonClicked) {
            HtmlToImage.toJpeg(document.getElementById('avatar'))
            .then(dataUrl => {
                const fileSize = getDownloadImageSize(dataUrl);
                if (fileSize < 1200 && numOfTrials < 10) {
                    setTimeout (
                        () => getJpegImage(numOfTrials + 1),
                        500
                    )
                } else {
                    setDownloadImage(dataUrl);
                }
            })
            .catch(error => error);
        };
    };

    const UploadButton = (
        <Button
            className={`upload-button ${isInPreviewMode ? 'preview' : ''}`}
            onClick={handleUploadButtonClick}
            disabled={isLoading && isPhotoUploaded}
        >
            <input
                ref={fileUploadRef}
                type="file"
                onChange={handleImageUpload}
            />
            {isLoading && isPhotoUploaded ? Locales[language]['SCANNING'] : Locales[language]['UPLOAD / TAKE YOUR PHOTO']}
        </Button>
    );

    const PrintButton = (
        <Button
            className={`print-button ${isInPreviewMode ? 'hidden' : ''}`}
            disabled={!isPhotoUploaded || isLoading || faceDetectionErrorCode || isInPreviewMode}
            onClick={() => setIsInPreviewMode(true)}
        >
            {Locales[language]['PREVIEW']}
        </Button>
    );

    const DownloadButton = (
        <Button
            className={`download-button ${isInPreviewMode ? 'displayed' : 'hidden'}`}
            disabled={isDownloadButtonClicked}
            onClick={handleDownloadButtonClick}
        >
            {isDownloadButtonClicked ? 'downloading...' : Locales[language]['DOWNLOAD']}
        </Button>
    );

    const CancelButton = (
        <Button
            className={`cancel-button ${isInPreviewMode ? 'displayed' : 'hidden'}`}
            onClick={() => setIsInPreviewMode(false)}
        >
            {Locales[language]['CANCEL']}
        </Button>
    );

    return (
        <>
            <div className="avatar-generator-container" id="avatar">
                {UploadButton}
                <div className="avatar-generator">
                    {isSelectionPanelOpen ? SelectPanel : OpenSelectionPanelButton}
                    {PhotoContainer}
                    {isPhotoUploaded && faceDetectionErrorCode ? <Warning errorCode={faceDetectionErrorCode}/> : null}
                    {!isPhotoUploaded ? <Instruction messages={Locales[language].INSTRUCTION}/> : null}
                    {isSetCostumesPanelOpen ? SetCostumes : OpenSetCostumesPanelButton}
                </div>
            </div>
            <div className="popup-button-container">
                {CancelButton}
                {DownloadButton}
            </div>
            {PrintButton}
        </>
    );
};

export default FacialLandmarks;
