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
    return {
        width: `${scaledImageWidth}px`,
        left: options.chin[0] - 0.5 * scaledImageWidth,
        top: topOfHead[1] + offset[1],
        zIndex: isLoading ? ApplicationConstants.Z_INDEX_HIDDEN : ApplicationConstants.Z_INDEX_BODY,
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
