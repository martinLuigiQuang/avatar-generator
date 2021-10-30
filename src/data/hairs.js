import item1 from '../assets/headware_female/HairFemShortBlack-01.png';
import item2 from '../assets/headware_female/HairFemShortBlonde-01.png';
import item3 from '../assets/headware_female/HairFemShortBrown-01.png';
import item4 from '../assets/headware_female/HairLongBlack-01.png';
import item5 from '../assets/headware_female/HairLongBlonde-01.png';
import item6 from '../assets/headware_female/HairLongBrown-01.png';
import item7 from '../assets/headware_female/Headband1-01.png';

const dimensions = {
    forehead: [100, 50],
    foreheadOffSet: [-275, 5],
    height: 100,
    width: 750
}

export const HAIRS = {
    female: [
        {
            name: item1,
            ...dimensions
        },
        {
            name: item2,
            ...dimensions
        },
        {
            name: item3,
            ...dimensions
        },
        {
            name: item4,
            ...dimensions
        },
        {
            name: item5,
            ...dimensions
        },
        {
            name: item6,
            ...dimensions
        },
        {
            name: item7,
            ...dimensions
        }
    ],
    male: []
};
