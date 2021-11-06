import ApplicationConstants from './constants';

import F1 from '../assets/headware_female/HairFemShortBlack-01.png';
import F2 from '../assets/headware_female/HairFemShortBlonde-01.png';
import F3 from '../assets/headware_female/HairFemShortBrown-01.png';
import F4 from '../assets/headware_female/HairLongBlack-01.png';
import F5 from '../assets/headware_female/HairLongBlonde-01.png';
import F6 from '../assets/headware_female/HairLongBrown-01.png';

import M1 from '../assets/headware_male/HairMaleShortBlack-01.png';
import M2 from '../assets/headware_male/HairMaleShortBlonde-01.png';
import M3 from '../assets/headware_male/HairMaleShortBrown-01.png';

const HAIRS = {
    female: [F1, F2, F3, F4, F5, F6],
    male: [M1, M2, M3]
};

const getRatio = (faceWidth) => {
    return faceWidth / ApplicationConstants.ASSETS_IMAGE_FOREHEAD_WIDTH;
};

export const getItem = (index, gender) => {
    return HAIRS[gender][index];
}; 

export const getStyles = (  
    faceWidth,
    topOfHead,
    offset,
    isLoading,
    options
) => {
    const ratio = getRatio(faceWidth);
    const scaledImageWidth = ratio * ApplicationConstants.ASSETS_IMAGE_WIDTH;
    const verticalOffset = ratio * ApplicationConstants.ASSETS_IMAGE_FOREHEAD_HEIGHT - (options.leftEyebrow[1] - topOfHead[1]);
    const imageVerticalOffset = ApplicationConstants.ASSETS_IMAGE_DISTANCE_TO_CHIN - ApplicationConstants.ASSETS_IMAGE_FACE_HEIGHT;
    return {
        width: `${scaledImageWidth}px`,
        left: topOfHead[0] - 0.5 * scaledImageWidth + offset[0],
        top: verticalOffset - ratio * imageVerticalOffset + offset[1],
        zIndex: isLoading ? ApplicationConstants.Z_INDEX_HIDDEN : ApplicationConstants.Z_INDEX_HAIR,
        transform: `rotateZ(${options.headTiltAngle}deg)`,
        transformOrigin: '50% 80px',
        display: isLoading ? 'none' : 'block'
    };
};

export const changeIndex = (value, gender, index) => {
    const change = parseInt(value);
    const arrayLength = HAIRS[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
