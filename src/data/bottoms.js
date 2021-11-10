import ApplicationConstants from './constants';
import Utils from '../utils';

import F1 from '../assets/bottoms_female/FemaleBotBlue-01.png';
import F2 from '../assets/bottoms_female/FemaleBotGreen-01.png';
import F3 from '../assets/bottoms_female/FemaleBotMagenta-01.png';
import F4 from '../assets/bottoms_female/FemaleBotOrange-01.png';
import F5 from '../assets/bottoms_female/FemaleBotRed-01.png';
import F6 from '../assets/bottoms_female/FemaleBotYellow-01.png';

import M1 from '../assets/bottoms_male/MaleBotBlue-01.png';
import M2 from '../assets/bottoms_male/MaleBotGreen-01.png';
import M3 from '../assets/bottoms_male/MaleBotPurple-01.png';
import M4 from '../assets/bottoms_male/MaleBotOrange-01.png';
import M5 from '../assets/bottoms_male/MaleBotRed-01.png';
import M6 from '../assets/bottoms_male/MaleBotYellow-01.png';

import * as Bodies from './bodies';

const UTILS = new Utils();

const BOTTOMS = {
    female: [F1, F2, F3, F4, F5, F6],
    male: [M1, M2, M3, M4, M5, M6]
};
BOTTOMS.genderNeutral = UTILS.generateGenderNeutralAccessoriesArray(BOTTOMS);
UTILS.insertNullAsset(BOTTOMS);

export const getItem = (index, gender) => {
    return BOTTOMS[gender][index];
};

export const getNumOfAssets = (gender) => {
    return BOTTOMS[gender].length;
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
    const arrayLength = BOTTOMS[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
