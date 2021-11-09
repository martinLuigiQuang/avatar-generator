import Utils from '../utils';

import F1 from '../assets/accessories_female/Sword-01.png';

import M1 from '../assets/accessories_male/Sword-01.png';
import M2 from '../assets/accessories_male/SwordMaleSizeHip-01.png';

import * as Bodies from './bodies';

const UTILS = new Utils();

const SWORDS = {
    female: [F1],
    male: [M1, M2]
};
UTILS.insertNullAsset(SWORDS);
SWORDS.genderNeutral = SWORDS.male;

export const getItem = (index, gender) => {
    return SWORDS[gender][index];
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
    const arrayLength = SWORDS[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
