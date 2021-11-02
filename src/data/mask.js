import F1 from '../assets/headware_female/Headband1-01.png';
import F2 from '../assets/headware_male/Headband2-01.png';
import F3 from '../assets/headware_male/MaskBlue-01.png';
import F4 from '../assets/headware_male/MaskGreen-01.png';
import F5 from '../assets/headware_male/MaskMagenta-01.png';
import F6 from '../assets/headware_male/MaskOrange-01.png';
import F7 from '../assets/headware_male/MaskRed-01-01.png';
import F8 from '../assets/headware_male/MaskRed-01.png';

import M1 from '../assets/headware_male/MaskBlue-01.png';
import M2 from '../assets/headware_male/MaskGreen-01.png';
import M3 from '../assets/headware_male/MaskMagenta-01.png';
import M4 from '../assets/headware_male/MaskOrange-01.png';
import M5 from '../assets/headware_male/MaskRed-01-01.png';
import M6 from '../assets/headware_male/MaskRed-01.png';

const dimensions = {
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


export const MASKS = {
    female: [
        {
            name: F1,
            ...dimensions
        },
        {
            name: F2,
            ...dimensions
        },
        {
            name: F3,
            ...dimensions
        },
        {
            name: F4,
            ...dimensions
        },
        {
            name: F5,
            ...dimensions
        },
        {
            name: F6,
            ...dimensions
        },
        {
            name: F7,
            ...dimensions
        },
        {
            name: F8,
            ...dimensions
        }
    ],
    male: [
        {
            name: M1,
            ...dimensions
        },
        {
            name: M2,
            ...dimensions
        },
        {
            name: M3,
            ...dimensions
        },
        {
            name: M4,
            ...dimensions
        },
        {
            name: M5,
            ...dimensions
        },
        {
            name: M6,
            ...dimensions
        }
    ]
};
