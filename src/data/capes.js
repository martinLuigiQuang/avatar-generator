import Utils from '../utils';

import F1 from '../assets/accessories_female/Cape1-01.png';
import F2 from '../assets/accessories_female/Cape2-01.png';

import M1 from '../assets/accessories_male/Cape1-01.png';
import M2 from '../assets/accessories_male/Cape2-01.png';

import * as Bodies from './bodies';

const UTILS = new Utils();

const CAPES = {
    female: [F1, F2],
    male: [M1, M2]
};
UTILS.insertNullAsset(CAPES);
CAPES.genderNeutral = CAPES.male;

export const getItem = (index, gender) => {
    return CAPES[gender][index];
};

export const getNumOfAssets = (gender) => {
    return CAPES[gender].length;
};

export const getStyles = (
    faceWidth,
    topOfHead,
    isLoading,
    options
) => {
    return Bodies.getStyles(faceWidth, topOfHead, isLoading, options);
};

export const changeIndex = (value, gender, index) => {
    const change = parseInt(value);
    const arrayLength = CAPES[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
