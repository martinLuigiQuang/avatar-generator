import F1 from '../assets/top_female/FemaleTopBlue-01.png';
import F2 from '../assets/top_female/FemaleTopGreen-01.png';
import F3 from '../assets/top_female/FemaleTopMagenta-01.png';
import F4 from '../assets/top_female/FemaleTopOrange-01.png';
import F5 from '../assets/top_female/FemaleTopRed-01.png';
import F6 from '../assets/top_female/FemaleTopYellow-01.png';

import M1 from '../assets/top_male/MaleTopBlue-01.png';
import M2 from '../assets/top_male/MaleTopGreen-01.png';
import M3 from '../assets/top_male/MaleTopPurple-01.png';
import M4 from '../assets/top_male/MaleTopOrange-01.png';
import M5 from '../assets/top_male/MaleTopRed-01.png';
import M6 from '../assets/top_male/MaleTopYellow-01.png';

const TOPS = {
    female: [F1, F2, F3, F4, F5, F6],
    male: [M1, M2, M3, M4, M5, M6]
};

export const getItem = (index, gender) => {
    return TOPS[gender][index];
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
