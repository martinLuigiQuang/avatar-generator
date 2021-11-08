import Utils from '../utils';

import F1 from '../assets/tops_female/FemaleTopBlue-01.png';
import F2 from '../assets/tops_female/FemaleTopGreen-01.png';
import F3 from '../assets/tops_female/FemaleTopMagenta-01.png';
import F4 from '../assets/tops_female/FemaleTopOrange-01.png';
import F5 from '../assets/tops_female/FemaleTopRed-01.png';
import F6 from '../assets/tops_female/FemaleTopYellow-01.png';

import M1 from '../assets/tops_male/MaleTopBlue-01.png';
import M2 from '../assets/tops_male/MaleTopGreen-01.png';
import M3 from '../assets/tops_male/MaleTopPurple-01.png';
import M4 from '../assets/tops_male/MaleTopOrange-01.png';
import M5 from '../assets/tops_male/MaleTopRed-01.png';
import M6 from '../assets/tops_male/MaleTopYellow-01.png';

import * as Bodies from './bodies';

const UTILS = new Utils();

const TOPS = {
    female: [F1, F2, F3, F4, F5, F6],
    male: [M1, M2, M3, M4, M5, M6],
    genderNeutral: []
};
TOPS.genderNeutral = UTILS.generateGenderNeutralAccessoriesArray(TOPS);

export const getItem = (index, gender) => {
    return TOPS[gender][index];
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
    const arrayLength = TOPS[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
