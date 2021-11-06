import ApplicationConstants from './constants';

import F1 from '../assets/body_female/FemaleBody1-01.png';
import F2 from '../assets/body_female/FemaleBody2-01.png';
import F3 from '../assets/body_female/FemaleBody3-01.png';

import M1 from '../assets/body_male/MaleBody1-01.png';
import M2 from '../assets/body_male/MaleBody2-01.png';
import M3 from '../assets/body_male/MaleBody3-01.png';

const BODIES = {
    female: [F1, F2, F3],
    male: [M1, M2, M3]
};

const getRatio = (faceWidth) => {
    return faceWidth / ApplicationConstants.ASSETS_IMAGE_FOREHEAD_WIDTH;
};

export const getItem = (index, gender) => {
    return BODIES[gender][index];
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
    const displayZIndex = options.isBehindBody ? ApplicationConstants.Z_INDEX_ACCESSORY : ApplicationConstants.Z_INDEX_BODY;
    const verticalOffset = (options.chin[1] - topOfHead[1]) - ratio * ApplicationConstants.ASSETS_IMAGE_DISTANCE_TO_CHIN;
    const imageVerticalOffset = (ApplicationConstants.ASSETS_IMAGE_DISTANCE_TO_CHIN - ApplicationConstants.ASSETS_IMAGE_FACE_HEIGHT);
    return {
        width: `${scaledImageWidth}px`,
        left: 0.52 * (topOfHead[0] + options.chin[0]) - 0.5 * scaledImageWidth,
        top: verticalOffset + offset[1],
        zIndex: isLoading ? ApplicationConstants.Z_INDEX_HIDDEN : displayZIndex,
        transformOrigin: '50% 100px',
        display: isLoading ? 'none' : 'block'
    };
};

export const changeIndex = (value, gender, index) => {
    const change = parseInt(value);
    const arrayLength = BODIES[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
