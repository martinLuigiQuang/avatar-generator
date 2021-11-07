import F1 from '../assets/accessories_female/Cape1-01.png';
import F2 from '../assets/accessories_female/Cape2-01.png';
import F3 from '../assets/accessories_female/FemaleHelm-01.png';
import F4 from '../assets/accessories_female/Shield-01.png';
import F5 from '../assets/accessories_female/Sword-01.png';

import M1 from '../assets/accessories_male/Cape1-01.png';
import M2 from '../assets/accessories_male/Cape2-01.png';
import M3 from '../assets/accessories_male/MaleHelm-01.png';
import M4 from '../assets/accessories_male/Shield-01.png';
import M5 from '../assets/accessories_male/Sword-01.png';
import M6 from '../assets/accessories_male/SwordMaleSizeHip-01.png';

import * as Bodies from './bodies';
import * as Masks from './masks';

const ACCESSORIES = {
    female: [F1, F2, F3, F4, F5],
    male: [M1, M2, M3, M4, M5, M6]
};

export const getItem = (index, gender) => {
    return ACCESSORIES[gender][index];
};

export const getStyles = (
    faceWidth,
    topOfHead,
    isLoading,
    options
) => {
    return options.isInFrontOfHair ? 
        Masks.getStyles(faceWidth, topOfHead, isLoading, options) : 
        Bodies.getStyles(faceWidth, topOfHead, isLoading, options);
};

export const changeIndex = (value, gender, index) => {
    const change = parseInt(value);
    const arrayLength = ACCESSORIES[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
