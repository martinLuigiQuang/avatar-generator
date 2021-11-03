import F1 from '../assets/headware_female/HairFemShortBlack-01.png';
import F2 from '../assets/headware_female/HairFemShortBlonde-01.png';
import F3 from '../assets/headware_female/HairFemShortBrown-01.png';
import F4 from '../assets/headware_female/HairLongBlack-01.png';
import F5 from '../assets/headware_female/HairLongBlonde-01.png';
import F6 from '../assets/headware_female/HairLongBrown-01.png';
import F7 from '../assets/headware_female/Headband1-01.png';
import F8 from '../assets/headware_female/Headband2-01.png';
import F9 from '../assets/headware_female/MaskBlue-01.png';
import F10 from '../assets/headware_female/MaskGreen-01.png';
import F11 from '../assets/headware_female/MaskMagenta-01.png';
import F12 from '../assets/headware_female/MaskOrange-01.png';
import F13 from '../assets/headware_female/MaskRed-01-01.png';
import F14 from '../assets/headware_female/MaskRed-01.png';

import M1 from '../assets/headware_male/HairMaleShortBlack-01.png';
import M2 from '../assets/headware_male/HairMaleShortBlonde-01.png';
import M3 from '../assets/headware_male/HairMaleShortBrown-01.png';

const dimensions_female = {
    forehead: [100, 50],
    foreheadOffSet: [-275, 18],
    height: 100,
    width: 750
};

const dimensions_female_headbands = {
    forehead: [100, 50],
    foreheadOffSet: [-275, -5],
    height: 100,
    width: 750
};

const dimensions_male = {
    forehead: [100, 50],
    foreheadOffSet: [-302, 5],
    height: 100,
    width: 800
}

const HAIRS = {
    female: [
        {
            src: F1,
            ...dimensions_female
        },
        {
            src: F2,
            ...dimensions_female
        },
        {
            src: F3,
            ...dimensions_female
        },
        {
            src: F4,
            ...dimensions_female
        },
        {
            src: F5,
            ...dimensions_female
        },
        {
            src: F6,
            ...dimensions_female
        },
        {
            src: F7,
            ...dimensions_female_headbands
        },
        {
            src: F8,
            ...dimensions_female_headbands
        },
        {
            src: F9,
            ...dimensions_female
        },
        {
            src: F10,
            ...dimensions_female
        },
        {
            src: F11,
            ...dimensions_female
        },
        {
            src: F12,
            ...dimensions_female
        },
        {
            src: F13,
            ...dimensions_female
        },
        {
            src: F14,
            ...dimensions_female
        }
    ],
    male: [
        {
            src: M1,
            ...dimensions_male
        },
        {
            src: M2,
            ...dimensions_male
        },
        {
            src: M3,
            ...dimensions_male
        }
    ]
};

const getRatio = (width, hair) => {
    return width / hair.forehead[0];
};

export const getHair = (index, gender) => {
    return HAIRS[gender][index].src;
}; 

export const getHairStyles = (
    index, 
    gender,    
    width,
    topOfHead,
    polarAngle,
    isLoading,
    imageStyle
) => {
    const hair = HAIRS[gender][index];
    return {
        width: `${getRatio(width, hair) * hair.width}px`,
        left: topOfHead[0] - 0.5 * getRatio(width, hair) * hair.width,
        top: topOfHead[1] + hair.foreheadOffSet[1],
        zIndex: isLoading ? -1 : 99,
        transform: `rotateZ(${polarAngle}deg)`,
        transformOrigin: '50% 100px',
        display: isLoading ? 'none' : 'block'
    }
};

export const getHairIndex = (value, gender, index) => {
    const change = parseInt(value);
    const hairsArrayLength = HAIRS[gender].length;
    if (index + change < 0) {
        return hairsArrayLength - 1;
    } else if (index + change >= hairsArrayLength) {
        return 0;
    }
    return index + change;
};
