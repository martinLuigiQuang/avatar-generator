import ApplicationConstants from './constants';
import Utils from '../utils';

import F1 from '../assets/headware_female/MaskBlue-01-cropped.png';
import F2 from '../assets/headware_female/MaskGreen-01-cropped.png';
import F3 from '../assets/headware_female/MaskMagenta-01-cropped.png';
import F4 from '../assets/headware_female/MaskOrange-01-cropped.png';
import F5 from '../assets/headware_female/Headband2-01-cropped.png';
import F6 from '../assets/headware_female/MaskRed-01-01-cropped.png';
import F7 from '../assets/headware_female/Headband1-01-cropped.png';

import M1 from '../assets/headware_female/MaskBlue-01-cropped.png';
import M2 from '../assets/headware_female/MaskGreen-01-cropped.png';
import M3 from '../assets/headware_female/MaskMagenta-01-cropped.png';
import M4 from '../assets/headware_female/MaskOrange-01-cropped.png';
import M5 from '../assets/headware_female/Headband2-01-cropped.png';
import M6 from '../assets/headware_female/MaskRed-01-01-cropped.png';
import M7 from '../assets/headware_female/Headband1-01-cropped.png';

const UTILS = new Utils();

const MASKS = {
    female: [F1, F2, F3, F4, F5, F6, F7],
    male: [M1, M2, M3, M4, M5, M6, M7]
};
UTILS.insertNullAsset(MASKS)
MASKS.genderNeutral = MASKS.female;

const getRatio = (width) => {
    return width / ApplicationConstants.ASSETS_IMAGE_FOREHEAD_WIDTH;
};

export const getItem = (index, gender) => {
    return MASKS[gender][index];
}; 

export const getNumOfAssets = (gender) => {
    return MASKS[gender].length;
};

export const getStyles = (
    faceWidth,
    topOfHead,
    isLoading,
    options
) => {
    const ratio = getRatio(faceWidth);
    const canvasLeftPosition = - options.chin[0] + 0.5 * options.scalingRatio * ApplicationConstants.IMAGE_STYLE.width;
    const canvasTopPosition = - topOfHead[1] + ApplicationConstants.AVATAR_TOP_POSITION;
    const imageLeftMargin = 0.5 * (1 - options.scalingRatio) * ApplicationConstants.IMAGE_STYLE.width;
    const scaledImageWidth = ratio * ApplicationConstants.ASSETS_IMAGE_WIDTH;
    const displayZIndex = options.isInFrontOfHair ? ApplicationConstants.Z_INDEX_HELM : ApplicationConstants.Z_INDEX_MASK;
    return {
        width: `${scaledImageWidth}px`,
        left: topOfHead[0] + canvasLeftPosition + imageLeftMargin - 0.5 * scaledImageWidth,
        top: options.leftEyebrow[1] + canvasTopPosition - ratio * (ApplicationConstants.ASSETS_IMAGE_DISTANCE_TO_LEFT_EYEBROW + ApplicationConstants.ASSETS_IMAGE_ADDED_TOP_MARGIN_MASKS),
        zIndex: isLoading ? ApplicationConstants.Z_INDEX_HIDDEN : ApplicationConstants.Z_INDEX_MASK,
        transform: `rotateZ(${options.headTiltAngle}deg)`,
        display: isLoading ? 'none' : 'block'
    };
};

export const changeIndex = (value, gender, index) => {
    const change = parseInt(value);
    const arrayLength = MASKS[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
