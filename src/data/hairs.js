import ApplicationConstants from './constants';
import Utils from '../utils';

import F1 from '../assets/headware_female/HairFemShortBlack-01-cropped.png';
import F2 from '../assets/headware_female/HairFemShortBlonde-01-cropped.png';
import F3 from '../assets/headware_female/HairFemShortBrown-01-cropped.png';
import F4 from '../assets/headware_female/HairLongBlack-01-cropped.png';
import F5 from '../assets/headware_female/HairLongBlonde-01-cropped.png';
import F6 from '../assets/headware_female/HairLongBrown-01-cropped.png';
import F7 from '../assets/headware_female/MaskRed-01.png';

import M1 from '../assets/headware_male/HairMaleShortBlack-01.png';
import M2 from '../assets/headware_male/HairMaleShortBlonde-01.png';
import M3 from '../assets/headware_male/HairMaleShortBrown-01.png';
import M4 from '../assets/headware_male/MaskRed-01.png';

const UTILS = new Utils();

const HAIRS = {
    female: [F1, F2, F3, F4, F5, F6],
    male: [M1, M2, M3]
};
HAIRS.genderNeutral = [...HAIRS.female.slice(0, HAIRS.female.length), ...HAIRS.male];
UTILS.insertNullAsset(HAIRS);

const HAIR_NAMES = {
    female: [],
    male: []
};
HAIR_NAMES.genderNeutral = [...HAIR_NAMES.female, ...HAIR_NAMES.male];

const getRatio = (faceWidth) => {
    return faceWidth / ApplicationConstants.ASSETS_IMAGE_FOREHEAD_WIDTH;
};

export const getItem = (index, gender) => {
    return HAIRS[gender][index];
}; 

export const getNumOfAssets = (gender) => {
    return HAIRS[gender].length;
};

export const getStyles = (  
    faceWidth,
    topOfHead,
    isLoading,
    options
) => {
    const ratio = getRatio(faceWidth);
    const canvasLeftPosition = - options.chin[0] + 0.5 * options.scalingRatio * ApplicationConstants.IMAGE_STYLE.width;
    const imageLeftMargin = 0.5 * (1 - options.scalingRatio) * ApplicationConstants.IMAGE_STYLE.width;
    const scaledImageWidth = ratio * ApplicationConstants.ASSETS_IMAGE_WIDTH;
    const rotationAxisYCoord = ratio * ApplicationConstants.ASSETS_IMAGE_DISTANCE_TO_TOP_OF_HEAD;
    return {
        width: `${scaledImageWidth}px`,
        left: topOfHead[0] + canvasLeftPosition + imageLeftMargin - 0.5 * scaledImageWidth,
        top: ApplicationConstants.AVATAR_TOP_POSITION - ratio * ApplicationConstants.ASSETS_IMAGE_DISTANCE_TO_TOP_OF_HEAD,
        zIndex: isLoading ? ApplicationConstants.Z_INDEX_HIDDEN : ApplicationConstants.Z_INDEX_HAIR,
        transform: `rotateZ(${options.headTiltAngle}deg)`,
        transformOrigin: `50% ${rotationAxisYCoord}px`,
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
