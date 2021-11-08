import * as React from 'react';
import './SpeechBubble.scss';

const SpeechBubble = (props) => {
    const { text, imgSrc, text2, text3, text4 } = props;
    return (
        <div className="speech-bubble">
            <img src={imgSrc} alt="speech bubble"/>
            <h2>{text}</h2>
            {text2 ? <p>{text2}</p> : null}
            {text3 ? <h2>{text3}</h2> : null} 
            {text4 ? <h2>{text4}</h2> : null} 
        </div>
    );
};

export default SpeechBubble;
