import * as React from 'react';
import * as tf from '@tensorflow/tfjs';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
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
import EventLogoEnglish from '../assets/Invincible_english.png';
import EventLogoSpanish from '../assets/Invincible_spanish.png';
import EventLogoPortuguese from '../assets/Invincible_portuguese.png';
import './FacialLandmarks.scss';

const UTILS = new Utils();
const IMAGE_STYLE = ApplicationConstants.IMAGE_STYLE;
const GENDER = Object.keys(ApplicationConstants.GENDER);

const FacialLandmarks = (props) => {
    const { language, firstName, lastName, superheroName } = props;

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
    const [ isWebcamOpen, setIsWebcamOpen ] = React.useState(false);
    
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
    const webcamRef = React.useRef(null);
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
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadImage;
                downloadLink.setAttribute('download', 'avatar.jpeg');
                document.body.appendChild(downloadLink);
                setDownloadImage(null);
                setIsDownloadButtonClicked(false);
                downloadLink.click();
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
       setHairIndex(UTILS.getCostumeIndex(Hairs.getNumOfAssets(GENDER[genderIndex]), hairIndex, true));
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

    const IMAGE = {
        english: EventLogoEnglish,
        spanish: EventLogoSpanish,
        portuguese: EventLogoPortuguese
    };

    const getImage = (language) => {
        return IMAGE[language];
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
            if (faceInformation && !faceInformation.status && !Number.isNaN(scalingRatio) && scalingRatio > 1) {
                setFaceDetectionErrorCode('faceTooSmall');
                setIsLoading(false);
            } else if (faceInformation && !faceInformation.status && !Number.isNaN(scalingRatio)) {
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
        if (isWebcamOpen) {
            setIsWebcamOpen(false);
        }
    };

    const handlePhotoTaking = () => {
        checkPhotoUpload();
        const screenShot = webcamRef.current.getScreenshot();
        photoRef.current.onload = () => URL.revokeObjectURL(photoRef.current.src);
        scaledPhotoRef.current.onload = () => URL.revokeObjectURL(scaledPhotoRef.current.src);
        photoRef.current.src = screenShot;
        scaledPhotoRef.current.src = screenShot;
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
        }
        if (isPhotoUploaded) {
            setIsPhotoUploaded(false);
        }
        fileUploadRef.current.click()
    };

    const handlePhotoTakingButtonClick = () => {
        if (faceDetectionErrorCode) {
            setFaceDetectionErrorCode(null);
        }
        if (isPhotoUploaded) {
            setIsPhotoUploaded(false);
        }
        if (!isWebcamOpen) {
            setIsWebcamOpen(true);
        }
    };

    const handleOpenPanel = (setThisPanelOpen, isOtherPanelOpen, setOtherPanelOpen) => {
        setThisPanelOpen(true);
        if (windowInnerWidth <= 600 && isOtherPanelOpen) {
            setOtherPanelOpen(false);
        }
    };

    const handleDownloadButtonClick = () => {
        const avatarElement = document.getElementById('avatar');
        avatarElement.setAttribute('style', 'width: 1600px');
        getJpegImage(1);
        setIsDownloadButtonClicked(true);
    };

    const getJpegImage = (numOfTrials) => {
        if (!isDownloadButtonClicked) {
            const maxNumOfTrials = 16;
            HtmlToImage.toJpeg(document.getElementById('avatar'), { quality: 0.9 })
            .then(dataUrl => {
                const fileSize = UTILS.getDownloadImageSize(dataUrl);
                if (numOfTrials < maxNumOfTrials) {
                    setTimeout(
                        () => getJpegImage(numOfTrials + 1),
                        500
                    )
                } else {
                    document.getElementById('avatar').removeAttribute('style');
                    setDownloadImage(dataUrl);
                }
            })
            .catch(error => error);
        };
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
                            language={language}
                        />
                    );
                })
            }
            {
                Object.keys(OPTIONS).map(key => {
                    const optionName = key.split('_')[1];
                    const text = Locales[language][`RANDOM ${optionName.toUpperCase()}`];
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
        <div className="image-container">
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
            style={{ width: IMAGE_STYLE.width }}
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

    const WebcamContainer = (
        <div className={`webcam-container ${isInPreviewMode ? 'hidden' : ''}`}>
            <Webcam
                ref={webcamRef}
                mirrored={true}
                screenshotFormat="image/jpeg"
                style={{
                    width: IMAGE_STYLE.width,
                    height: 0.75 * IMAGE_STYLE.width,
                }}
            />
            <div 
                className={`popup-button-container ${isInPreviewMode ? 'hidden' : ''}`}
                style={{width: 640}}
            >
                <Button
                    className={`cancel-button ${isInPreviewMode ? 'hidden' : ''}`}
                    onClick={() => setIsWebcamOpen(false)}
                >
                    {Locales[language]["CANCEL"]}
                </Button>
                <Button
                    className={`capture-button ${isInPreviewMode ? 'hidden' : ''}`}
                    onClick={handlePhotoTaking}
                >
                    {Locales[language]['TAKE PHOTO']}
                </Button>
            </div>
        </div>
    );

    const TakePhotoButton = (
        <Button
            className="take-photo-button"
            onClick={handlePhotoTakingButtonClick}
            disabled={isLoading && isPhotoUploaded || isInPreviewMode || isWebcamOpen}
        >
            {Locales[language]['TAKE YOUR PHOTO']}
        </Button>
    );

    const UploadButton = (
        <Button
            className="upload-button"
            onClick={handleUploadButtonClick}
            disabled={isLoading && isPhotoUploaded || isInPreviewMode}
        >
            <input
                ref={fileUploadRef}
                type="file"
                onChange={handleImageUpload}
            />
            {Locales[language]['UPLOAD YOUR PHOTO']}
        </Button>
    );

    const BackButton = (
        <div className={`back-button-link ${isInPreviewMode ? 'hidden': 'displayed'}`}>
            <Link to="/enterName">{`${Locales[language]['BACK']}`}</Link>
        </div>
    );

    const PreviewButton = (
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
            className={`download-button ${isInPreviewMode ? 'displayed' : 'hidden'} ${isDownloadButtonClicked ? 'show-progress' : ''}`}
            disabled={isDownloadButtonClicked}
            onClick={handleDownloadButtonClick}
        >
            {isDownloadButtonClicked ? Locales[language]['DOWNLOADING'] : Locales[language]['DOWNLOAD']}
        </Button>
    );

    const CancelButton = (
        <Button
            className={`cancel-button ${isInPreviewMode && !isDownloadButtonClicked ? 'displayed' : 'hidden'}`}
            onClick={() => setIsInPreviewMode(false)}
        >
            {Locales[language]['CANCEL']}
        </Button>
    );

    const DisplayButton = (
        <Button
            className="display-button"
            disabled={isLoading && isPhotoUploaded}
        >
            {Locales[language]['SCANNING']}
        </Button>
    );

    return (
        <>
            <div className="popup-button-container">
                {
                    isLoading && isPhotoUploaded ?
                    DisplayButton :
                    (
                        <>
                            {UploadButton} 
                            {TakePhotoButton}
                        </>
                    )
                }
            </div>
            <div className={`avatar-generator-container ${isInPreviewMode ? 'preview-screen' : ''}`} id="avatar">
                <img src={getImage(language)} alt="invincible" id="invincible" className={`${isInPreviewMode ? '' : 'hidden'}`}/>
                <div className="avatar-generator">
                    {isSelectionPanelOpen ? SelectPanel : OpenSelectionPanelButton}
                    {PhotoContainer}
                    {isWebcamOpen ? WebcamContainer : null}
                    {isPhotoUploaded && faceDetectionErrorCode ? <Warning errorCode={faceDetectionErrorCode}/> : null}
                    {!isPhotoUploaded && !isWebcamOpen ? <Instruction messages={Locales[language].INSTRUCTION}/> : null}
                    {isSetCostumesPanelOpen ? SetCostumes : OpenSetCostumesPanelButton}
                </div>
                <div className={`names-container ${isLoading || !isPhotoUploaded || faceDetectionErrorCode ? 'hidden' : ''}`}>
                    <h2 className="names">{firstName} {lastName}</h2>
                    <h2 className="aka">AKA</h2>
                    <h1 className="superhero-name">{superheroName}</h1>
                </div>
            </div>
            <div className="popup-button-container">
                {CancelButton}
                {DownloadButton}
            </div>
            <div className="popup-button-container">
                {BackButton}
                {PreviewButton}
            </div>
        </>
    );
};

export default FacialLandmarks;
