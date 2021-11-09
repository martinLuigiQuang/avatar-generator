import Utils from '../utils';

import F1 from '../assets/accessories_female/Shield-01.png';

import M1 from '../assets/accessories_male/Shield-01.png';

import * as Bodies from './bodies';

const UTILS = new Utils;

const SHIELDS = {
    female: [F1],
    male: [M1]
};
UTILS.insertNullAsset(SHIELDS);
SHIELDS.genderNeutral = SHIELDS.male;

export const getItem = (index, gender) => {
    return SHIELDS[gender][index];
};

export const getStyles = (
    faceWidth,
    topOfHead,
    isLoading,
    options
) => {
    const isTop = true;
    return Bodies.getStyles(faceWidth, topOfHead, isLoading, {...options, isTop});
};

export const changeIndex = (value, gender, index) => {
    const change = parseInt(value);
    const arrayLength = SHIELDS[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
