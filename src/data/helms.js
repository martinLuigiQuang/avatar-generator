import Utils from '../utils';

import F1 from '../assets/accessories_female/FemaleHelm-01.png';

import M1 from '../assets/accessories_male/MaleHelm-01.png';

import * as Masks from './masks';

const UTILS = new Utils();

const HELMS = {
    female: [F1],
    male: [M1]
};
HELMS.genderNeutral = UTILS.generateGenderNeutralAccessoriesArray(HELMS);
UTILS.insertNullAsset(HELMS);

export const getItem = (index, gender) => {
    return HELMS[gender][index];
};

export const getNumOfAssets = (gender) => {
    return HELMS[gender].length;
};

export const getStyles = (
    faceWidth,
    topOfHead,
    isLoading,
    options
) => {
    return Masks.getStyles(faceWidth, topOfHead, isLoading, options);
};

export const changeIndex = (value, gender, index) => {
    const change = parseInt(value);
    const arrayLength = HELMS[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
