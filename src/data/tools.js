import Utils from '../utils';

import F1 from '../assets/accessories_female/Sword-01.png';
import F2 from '../assets/accessories_male/SwordMaleSizeHip-01.png';
import F3 from '../assets/accessories_male/GoldenWhip-01.png';
import F4 from '../assets/accessories_male/Hammer-01.png';
import F5 from '../assets/accessories_male/StaffBlue-01.png';
import F6 from '../assets/accessories_male/StaffGold-01-01.png';
import F7 from '../assets/accessories_male/Whip-01.png';

import M1 from '../assets/accessories_male/Sword-01.png';
import M2 from '../assets/accessories_male/SwordMaleSizeHip-01.png';
import M3 from '../assets/accessories_male/GoldenWhip-01.png';
import M4 from '../assets/accessories_male/Hammer-01.png';
import M5 from '../assets/accessories_male/StaffBlue-01.png';
import M6 from '../assets/accessories_male/StaffGold-01-01.png';
import M7 from '../assets/accessories_male/Whip-01.png';

import * as Bodies from './bodies';

const UTILS = new Utils();

const OPTIONS = {
    female: [F1, F2, F3, F4, F5, F6, F7],
    male: [M1, M2, M3, M4, M5, M6, M7]
};
UTILS.insertNullAsset(OPTIONS);
OPTIONS.genderNeutral = OPTIONS.male;

export const getItem = (index, gender) => {
    return OPTIONS[gender][index];
};

export const getNumOfAssets = (gender) => {
    return OPTIONS[gender].length;
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
    const arrayLength = OPTIONS[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
