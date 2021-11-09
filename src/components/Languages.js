import * as React from 'react';
import SpeechBubble from './SpeechBubble';
import Bubble from '../assets/speech_bubble_2.png';
import { Link } from 'react-router-dom';
import locale from '../data/locales.json';
import './Languages.scss';

const LanguageSelector = (props) => {
  const { handleLanguageSelector, language } = props;

  // React.useEffect(() => setIsFirstPage(true), []);

  return (
    <div className={`${language}`}>
    
      <form className="language-container">
        <label htmlFor="english">
          <input type="radio" id="english" name="language" value="english" checked={language === 'english'} onChange={handleLanguageSelector} />
          <SpeechBubble
            text="English"
            imgSrc={Bubble}
          />
        </label>
        <label htmlFor="spanish">
          <input type="radio" id="spanish" name="language" value="spanish" checked={language === 'spanish'} onChange={handleLanguageSelector} />
          <SpeechBubble
            text="Español"
            imgSrc={Bubble}
          />
        </label>
        <label htmlFor="portuguese">
          <input type="radio" id="portuguese" name="language" value="portuguese" checked={language === 'portuguese'} onChange={handleLanguageSelector} />
          <SpeechBubble
            text="Português"
            imgSrc={Bubble}
          />
        </label>
        <div className="navigation-bar">
          <Link to="/enterName">{`${locale[language]['NEXT']} >`}</Link>
        </div>
      </form>
    </div>
  );
};

export default LanguageSelector;
