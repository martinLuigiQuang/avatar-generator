import ApplicationConstants from './constants';
import Utils from '../utils';

import F1 from '../assets/body_female/FemaleBody01-01.png';
import F2 from '../assets/body_female/FemaleBody02-01.png';
import F3 from '../assets/body_female/FemaleBody03-01.png';

import M1 from '../assets/body_male/MaleBody01-01.png';
import M2 from '../assets/body_male/MaleBody02-01.png';
import M3 from '../assets/body_male/MaleBody03-01.png';

const UTILS = new Utils();

const BODIES = {
    female: [F1, F2, F3],
    male: [M1, M2, M3]
};
BODIES.genderNeutral = UTILS.generateGenderNeutralAccessoriesArray(BODIES);


const getRatio = (faceWidth) => {
    return faceWidth / ApplicationConstants.ASSETS_IMAGE_FOREHEAD_WIDTH;
};

const getAverage = (a, b) => {
    return (a + b) / 2;
};

export const getItem = (index, gender) => {
    return BODIES[gender][index];
}; 

export const getStyles = (   
    faceWidth,
    topOfHead,
    isLoading,
    options
) => {
    const ratio = getRatio(faceWidth);
    const imageLeftMargin = 0.5 * (1 - options.scalingRatio) * ApplicationConstants.IMAGE_STYLE.width;
    const scaledImageWidth = ratio * ApplicationConstants.ASSETS_IMAGE_WIDTH;
    const displayZIndex = options.isBehindBody ? ApplicationConstants.Z_INDEX_CAPE : 
                          options.isTop ? ApplicationConstants.Z_INDEX_TOP : ApplicationConstants.Z_INDEX_BODY;
    return {
        width: `${scaledImageWidth}px`,
        left: getAverage(topOfHead[0], options.chin[0]) + imageLeftMargin - 0.5 * scaledImageWidth,
        top: options.chin[1] - ratio * ApplicationConstants.ASSETS_IMAGE_DISTANCE_TO_CHIN,
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
