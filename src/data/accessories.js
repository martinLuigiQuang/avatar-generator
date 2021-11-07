import F1 from '../assets/accessories_female/Cape1-01.png';
import F2 from '../assets/accessories_female/Cape2-01.png';
import F3 from '../assets/accessories_female/GlovesBlue-01.png';
import F4 from '../assets/accessories_female/GlovesGreen-01.png';
import F5 from '../assets/accessories_female/GlovesMagenta-01.png';
import F6 from '../assets/accessories_female/GlovesOrange-01.png';
import F7 from '../assets/accessories_female/GlovesPurple-01.png';
import F8 from '../assets/accessories_female/GlovesRed-01.png';
import F9 from '../assets/accessories_female/GlovesYellow-01.png';
import F10 from '../assets/accessories_female/Shield-01.png';
import F11 from '../assets/accessories_female/Sword-01.png';
import F12 from '../assets/accessories_female/FemaleHelm-01.png';

import M1 from '../assets/accessories_male/Cape1-01.png';
import M2 from '../assets/accessories_male/Cape2-01.png';
import M3 from '../assets/accessories_male/GlovesBlue-01.png';
import M4 from '../assets/accessories_male/GlovesGreen-01.png';
import M5 from '../assets/accessories_male/GlovesMagenta-01.png';
import M6 from '../assets/accessories_male/GlovesOrange-01.png';
import M7 from '../assets/accessories_male/GlovesPurple-01.png';
import M8 from '../assets/accessories_male/GlovesRed-01.png';
import M9 from '../assets/accessories_male/GlovesYellow-01.png';
import M10 from '../assets/accessories_male/Shield-01.png';
import M11 from '../assets/accessories_male/Sword-01.png';
import M12 from '../assets/accessories_male/SwordMaleSizeHip-01.png';
import M13 from '../assets/accessories_male/MaleHelm-01.png';

import * as Bodies from './bodies';

const TOPS = {
    female: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12],
    male: [M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11, M12, M13]
};

export const getItem = (index, gender) => {
    return TOPS[gender][index];
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
    const arrayLength = TOPS[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};