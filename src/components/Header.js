import * as React from 'react';
import EventLogoEnglish from '../assets/Invincible_english.png';
import EventLogoSpanish from '../assets/Invincible_spanish.png';
import EventLogoPortuguese from '../assets/Invincible_portuguese.png';
import locale from '../data/locales.json';
import './Header.scss';

const Header = (props) => {
    const { language, isFirstPage } = props;

    return (
        <header>
            <div className="company-name">
                {
                    !isFirstPage ?
                        (language === 'english' ?
                            <img src={EventLogoEnglish} alt="Invincible event logo" /> :
                            language === 'spanish' ?
                                <img src={EventLogoSpanish} alt="Invincible event logo" /> :
                                <img src={EventLogoPortuguese} alt="Invincible event logo" />
                        ) :
                        <div></div>
                }
                <h1>{locale[language]['CALA SUPERHERO AVATAR GENERATOR']}</h1>
            </div>
        </header>
    );
};

export default Header;
