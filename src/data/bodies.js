import F1 from '../assets/body_female/FemaleBody1-01.png';
import F2 from '../assets/body_female/FemaleBody2-01.png';
import F3 from '../assets/body_female/FemaleBody3-01.png';

import M1 from '../assets/body_female/MaleBody1-01.png';
import M2 from '../assets/body_female/MaleBody2-01.png';
import M3 from '../assets/body_female/MaleBody3-01.png';

const dimensions = {
    height: 100,
    width: 750
};

const BODIES = {
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
        }
    ]
};

const getRatio = (width) => {
    return width / 100;
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
    isLoading
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
