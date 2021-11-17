import * as React from 'react';
import Button from '@material-ui/core/Button';
import ApplicationConstants from '../data/constants';
import { ERROR_MESSAGES } from '../data/errorMessages';

export const AvatarButtons = (props) => {
    const { value, handleClick, isDisabled } = props;
    return (
        <div className="buttons-container">
            <Button onClick={handleClick} disabled={isDisabled}>
                {ApplicationConstants.DECREASE_INDEX}
            </Button>
            <h3 className={`${isDisabled ? 'disabled' : ''}`}>
                {value.toUpperCase()}
            </h3>
            <Button onClick={handleClick} disabled={isDisabled}>
                {ApplicationConstants.INCREASE_INDEX}
            </Button>
        </div>
    );
};

export const OptionsButton = (props) => {
    const { index, handleClick, name, isDisabled } = props;
    const value = name === 'body' ? `body ${index + 1}` : 
                  name === 'mask / headwear' ? `mask ${index}` : 
                  name === 'tools' ? `tool ${index}` :
                  name === 'gender' ? index : `${name} ${index}`;
    return (
        <div className="option-button-container">
            <p>{name}</p>
            <AvatarButtons 
                value={value} 
                handleClick={handleClick} 
                isDisabled={isDisabled}
            />
        </div>
    );
};

export const AvatarOptions = (props) => {
    const { options, title, gender, isDisabled, bodyGender } = props;
    return (
        <div className={`avatar-options-container`} id={title}>
            <h2>{title.split('_')[1]}</h2>
            {
                Object.keys(options).map(key => {
                    const item = options[key];
                    const sourceGender = ApplicationConstants.GENDER[gender] === ApplicationConstants.GENDER.genderNeutral && key !== 'hair' && key !== 'body' ? bodyGender : gender;
                    const handleClick = (e) => {
                        const change = e.target.innerText === ApplicationConstants.INCREASE_INDEX ? 1 : -1;
                        let newIndex;
                        if (key === 'gender') {
                            switch (item.index + change) {
                                case -1: 
                                    newIndex = 2;
                                    break;
                                case 3:
                                    newIndex = 0
                                    break;
                                default:
                                    newIndex = item.index + change; 
                            }
                        } else {
                            newIndex = item.assets.changeIndex(change, sourceGender, item.index);
                        }
                        item.setIndex(newIndex);
                    };
                    return (
                        <OptionsButton
                            key={key}
                            name={key}
                            index={key === 'gender' ? ApplicationConstants.GENDER[gender] : item.index}
                            handleClick={handleClick}
                            isDisabled={isDisabled}
                        />
                    );
                })
            }
        </div>
    );
};

export const AvatarAccessory = React.forwardRef((props, ref) => {
    const { title, src, style } = props;
    return (
        src !== ApplicationConstants.NULL_ASSETS_CODE ? 
        <img ref={ref} src={src} id={title} alt={title} className={title} style={style} /> :
        null 
    );
});

export const ScaledUploadedPhoto = React.forwardRef((props, ref) => {
    const { src, style } = props;
    const title = "scaled-uploaded-photo";
    return <img ref={ref} src={src} id={title} alt={title} style={style} />;
});

export const Warning = (props) => {
    const { errorCode } = props;
    return (
        <div className="warning-container">
            <h2>{ERROR_MESSAGES[errorCode]} Please upload a different photo.</h2>
        </div>
    );
};

export const Instruction = (props) => {
    const { messages } = props;
    return (
        <div className="instruction-container">
            {messages.map((line, index) => <h2 key={index}>{line}</h2>)}
        </div>
    );
};

export const AvatarAccessoryDisplay = (props) => {
    const { optionsArray, gender, parentStates } = props;
    const { faceWidth, topOfHead, isLoading, scalingRatio, headTiltAngle, chin, leftEyebrow, bodyGender } = parentStates;
    const genderValue = ApplicationConstants.GENDER[gender];
    const options = optionsArray.reduce(
        (outputObj, item) => {
            Object.keys(item).forEach(key => outputObj[key] = item[key]);
            return outputObj;
        },
        {}
    );
    return (
        <>
            {
                Object.keys(options).map(key => {
                    if (key === 'gender') {
                        return null;
                    }
                    const item = options[key];
                    const isBehindBody = key === 'cape'
                    const isInFrontOfHair = key === 'mask / headwear' && item.index >= item.assets.getNumOfAssets(gender) - 2;
                    const sourceGender = genderValue === ApplicationConstants.GENDER.genderNeutral && key !== 'hair' && key !== 'body' ? bodyGender : gender;
                    const src = item.assets.getItem(item.index, sourceGender);
                    if (!src) {
                        item.setIndex(0);
                    }
                    const style = item.assets.getStyles(
                        faceWidth,
                        topOfHead,
                        isLoading,
                        { scalingRatio, headTiltAngle, chin, leftEyebrow, isBehindBody, isInFrontOfHair }
                    );
                    return (
                        <AvatarAccessory
                            key={key}
                            title={`${key} accessory-option`}
                            src={src || ApplicationConstants.NULL_ASSETS_CODE}
                            ref={item.ref}
                            style={style}
                        />
                    );
                })
            }
        </>
    );
};

export const SetCostumesOptions = (props) => {
    const { color, disabled, handleClick } = props;
    const background = `linear-gradient(135deg, whitesmoke, ${disabled ? 'gray' : color === 'blank' ? 'gray' : color})`;
    const wildCardBackground = `linear-gradient(135deg, whitesmoke, ${disabled ? 'gray' : '#e66465, lightblue, whitesmoke'})`;
    return (
        <div className="set-costume-button-container">
            <label>{color}</label>
            <Button 
                className="set-costume-button"
                style={{
                    background: color !== 'wildcard' ? background : wildCardBackground
                }}
                disabled={disabled}
                onClick={handleClick}
            />
        </div>
    );
};

export const PanelButton = (props) => {
    const { className, handleClick, text } = props;
    return (
        <Button
            className={className}
            onClick={handleClick}
        >
            {text}
        </Button>
    );
};
