import Utils from '../utils';

import F1 from '../assets/footware_female/FootBlue-01.png';
import F2 from '../assets/footware_female/FootGreen-01.png';
import F3 from '../assets/footware_female/FootMagenta-01.png';
import F4 from '../assets/footware_female/FootOrange-01.png';
import F5 from '../assets/footware_female/FootRed-01.png';
import F6 from '../assets/footware_female/FootYellow-01.png';

import M1 from '../assets/footware_male/MaleFootBlue-01.png';
import M2 from '../assets/footware_male/MaleFootGreen-01.png';
import M3 from '../assets/footware_male/MaleFootPurple-01.png';
import M4 from '../assets/footware_male/MaleFootOrange-01.png';
import M5 from '../assets/footware_male/MaleFootRed-01.png';
import M6 from '../assets/footware_male/MaleFootYellow-01.png';

import * as Bodies from './bodies';

const UTILS = new Utils();

const FOOTWARES = {
    female: [F1, F2, F3, F4, F5, F6],
    male: [M1, M2, M3, M4, M5, M6]
};
FOOTWARES.genderNeutral = FOOTWARES.male;
UTILS.insertNullAsset(FOOTWARES);

export const getItem = (index, gender) => {
    return FOOTWARES[gender][index];
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
    const arrayLength = FOOTWARES[gender].length;
    if (index + change < 0) {
        return arrayLength - 1;
    } else if (index + change >= arrayLength) {
        return 0;
    }
    return index + change;
};
