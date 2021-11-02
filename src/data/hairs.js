import F1 from '../assets/headware_female/HairFemShortBlack-01.png';
import F2 from '../assets/headware_female/HairFemShortBlonde-01.png';
import F3 from '../assets/headware_female/HairFemShortBrown-01.png';
import F4 from '../assets/headware_female/HairLongBlack-01.png';
import F5 from '../assets/headware_female/HairLongBlonde-01.png';
import F6 from '../assets/headware_female/HairLongBrown-01.png';

import M1 from '../assets/headware_male/HairMaleShortBlack-01.png';
import M2 from '../assets/headware_male/HairMaleShortBlonde-01.png';
import M3 from '../assets/headware_male/HairMaleShortBrown-01.png';

const dimensions_female = {
    forehead: [100, 50],
    foreheadOffSet: [-275, 5],
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
        left: topOfHead[0] - 1 * getRatio(width, hair) * (hair.width - hair.forehead[0] + hair.foreheadOffSet[0]),
        top: topOfHead[1] - 1 * getRatio(width, hair) * (hair.height - hair.forehead[1] + hair.foreheadOffSet[1]) + imageStyle.top,
        zIndex: isLoading ? -1 : 99,
        transform: `rotateZ(${polarAngle}deg)`,
        transformOrigin: '50% 100px',
        display: isLoading ? 'none' : 'block'
    }
};

export const getHairIndex = (change, gender, index) => {
    const hairsArrayLength = HAIRS[gender].length;
    if (index + change < 0) {
        return hairsArrayLength - 1;
    } else if (index + change >= hairsArrayLength) {
        return 0;
    }
    return index + change;
};
