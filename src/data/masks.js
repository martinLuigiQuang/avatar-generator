import ApplicationConstants from './constants';

import F1 from '../assets/headware_female/Headband1-01.png';
import F2 from '../assets/headware_female/Headband2-01.png';
import F3 from '../assets/headware_female/MaskBlue-01.png';
import F4 from '../assets/headware_female/MaskGreen-01.png';
import F5 from '../assets/headware_female/MaskMagenta-01.png';
import F6 from '../assets/headware_female/MaskOrange-01.png';
import F7 from '../assets/headware_female/MaskRed-01-01.png';
import F8 from '../assets/headware_female/MaskRed-01.png';

import M1 from '../assets/headware_male/MaskBlue-01.png';
import M2 from '../assets/headware_male/MaskGreen-01.png';
import M3 from '../assets/headware_male/MaskMagenta-01.png';
import M4 from '../assets/headware_male/MaskOrange-01.png';
import M5 from '../assets/headware_male/MaskRed-01-01.png';
import M6 from '../assets/headware_male/MaskRed-01.png';

const MASKS = {
    female: [F1, F2, F3, F4, F5, F6, F7, F8],
    male: [M1, M2, M3, M4, M5, M6]
};

const getRatio = (width) => {
    return width / ApplicationConstants.ASSETS_IMAGE_FOREHEAD_WIDTH;
};

export const getMask = (index, gender) => {
    return MASKS[gender][index];
}; 

export const getMaskStyles = (
    width,
    topOfHead,
    leftEyebrow,
    headTiltAngle,
    isLoading
) => {
    const ratio = getRatio(width);
    const assetImageWidth = ApplicationConstants.ASSETS_IMAGE_WIDTH;
    console.log(leftEyebrow)
    return {
        width: `${ratio * assetImageWidth}px`,
        left: topOfHead[0] - 0.5 * ratio * assetImageWidth,
        top: topOfHead[1],
        zIndex: isLoading ? ApplicationConstants.Z_INDEX_HIDDEN : ApplicationConstants.Z_INDEX_MASK,
        transform: `rotateZ(${headTiltAngle}deg)`,
        transformOrigin: '50% 100px',
        display: isLoading ? 'none' : 'block'
    };
};

export const getMaskIndex = (value, gender, index) => {
    const change = parseInt(value);
    const masksArrayLength = MASKS[gender].length;
    if (index + change < 0) {
        return masksArrayLength - 1;
    } else if (index + change >= masksArrayLength) {
        return 0;
    }
    return index + change;
};