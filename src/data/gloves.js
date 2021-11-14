import Utils from '../utils';

import F1 from '../assets/accessories_female/GlovesBlue-01.png';
import F2 from '../assets/accessories_female/GlovesGreen-01.png';
import F3 from '../assets/accessories_female/GlovesMagenta-01.png';
import F4 from '../assets/accessories_female/GlovesOrange-01.png';
import F5 from '../assets/accessories_female/GlovesRed-01.png';
import F6 from '../assets/accessories_female/GlovesYellow-01.png';
import F7 from '../assets/accessories_female/GlovesPurple-01.png';

import M1 from '../assets/accessories_male/GlovesBlue-01.png';
import M2 from '../assets/accessories_male/GlovesGreen-01.png';
import M3 from '../assets/accessories_male/GlovesPurple-01.png';
import M4 from '../assets/accessories_male/GlovesOrange-01.png';
import M5 from '../assets/accessories_male/GlovesRed-01.png';
import M6 from '../assets/accessories_male/GlovesYellow-01.png';
import M7 from '../assets/accessories_male/GlovesMagenta-01.png';

import * as Bodies from './bodies';

const UTILS = new Utils();

const GLOVES = {
    female: [F1, F2, F3, F4, F5, F6, F7],
    male: [M1, M2, M3, M4, M5, M6, M7]
};
UTILS.insertNullAsset(GLOVES);
GLOVES.genderNeutral = GLOVES.female;

export const getItem = (index, gender) => {
    return GLOVES[gender][index];
};

export const getNumOfAssets = (gender) => {
    return GLOVES[gender].length;
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
    const arrayLength = GLOVES[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
