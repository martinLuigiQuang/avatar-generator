import F1 from '../assets/headware_female/Headband1-01.png';
import F2 from '../assets/headware_female/Headband2-01.png';
import F3 from '../assets/headware_female/MaskBlue-01.png';
import F4 from '../assets/headware_female/MaskGreen-01.png';
import F5 from '../assets/headware_female/MaskMagenta-01.png';
import F6 from '../assets/headware_female/MaskOrange-01.png';
import F7 from '../assets/headware_female/MaskRed-01-01.png';
import F8 from '../assets/headware_female/MaskRed-01.png';

import M1 from '../assets/headware_male/MaskBlue-01.png';
import M2 from '../assets/headware_male/MaskGreen-01.png';
import M3 from '../assets/headware_male/MaskMagenta-01.png';
import M4 from '../assets/headware_male/MaskOrange-01.png';
import M5 from '../assets/headware_male/MaskRed-01-01.png';
import M6 from '../assets/headware_male/MaskRed-01.png';

const dimensions = {
    forehead: [100, 50],
    forheadOffset: [0, 5],
    height: 100,
    width: 750
};

const dimensions_male = {
    height: 100,
    width: 800
}


const MASKS = {
    female: [
        {
            src: F1,
            ...dimensions
        },
        {
            src: F2,
            ...dimensions
        },
        {
            src: F3,
            ...dimensions
        },
        {
            src: F4,
            ...dimensions
        },
        {
            src: F5,
            ...dimensions
        },
        {
            src: F6,
            ...dimensions
        },
        {
            src: F7,
            ...dimensions
        },
        {
            src: F8,
            ...dimensions
        }
    ],
    male: [
        {
            src: M1,
            ...dimensions
        },
        {
            src: M2,
            ...dimensions
        },
        {
            src: M3,
            ...dimensions
        },
        {
            src: M4,
            ...dimensions
        },
        {
            src: M5,
            ...dimensions
        },
        {
            src: M6,
            ...dimensions
        }
    ]
};

const getRatio = (width, mask) => {
    return width / mask.forehead[0];
};

export const getMask = (index, gender) => {
    return MASKS[gender][index].src;
}; 

export const getMaskStyles = (
    index, 
    gender,    
    width,
    topOfHead,
    polarAngle,
    isLoading
) => {
    const mask = MASKS[gender][index];
    return {
        width: `${getRatio(width, mask) * mask.width}px`,
        left: topOfHead[0] - 0.5 * getRatio(width, mask) * mask.width,
        top: topOfHead[1] - mask.forheadOffset[1],
        zIndex: isLoading ? -1 : 98,
        transform: `rotateZ(${polarAngle}deg)`,
        transformOrigin: '50% 100px',
        display: isLoading ? 'none' : 'block'
    }
};

export const getMaskIndex = (value, gender, index) => {
    const change = parseInt(value);
    const masksArrayLength = MASKS[gender].length;
    if (index + change < 0) {
        return masksArrayLength - 1;
    } else if (index + change >= masksArrayLength) {
        return 0;
    }
    return index + change;
};