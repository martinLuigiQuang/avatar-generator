import * as React from 'react';
import Button from '@material-ui/core/Button';
import ApplicationConstants from '../data/constants';

export const AvatarButtons = (props) => {
    const { value, handleClick } = props;
    return (
        <div className="buttons-container">
            <Button onClick={handleClick}>
                {ApplicationConstants.DECREASE_INDEX}
            </Button>
            <h3>{`${value}`.split(/(?=[A-Z]|[0-9])/).join(' ').toUpperCase()}</h3>
            <Button onClick={handleClick}>
                {ApplicationConstants.INCREASE_INDEX}
            </Button>
        </div>
    );
};

export const OptionsButton = (props) => {
    const { index, handleClick, name } = props;
    return (
        <div className="option-button-container">
            <p>{name}</p>
            <AvatarButtons value={index} handleClick={handleClick} />
        </div>
    );
};

export const AvatarOptions = (props) => {
    const { options, title, gender } = props;
    return (
        <div className={`avatar-options-container`} id={title}>
            <h2>{title.split('-').join(' ')}</h2>
            {
                Object.keys(options).map(key => {
                    const item = options[key];
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
                            newIndex = item.assets.changeIndex(change, gender, item.index);
                        }
                        item.setIndex(newIndex);
                    };
                    return (
                        <OptionsButton
                            key={key}
                            name={key}
                            index={key === 'gender' ? gender : item.index}
                            handleClick={handleClick}
                        />
                    );
                })
            }
        </div>
    );
};

export const AvatarAccessory = React.forwardRef((props, ref) => {
    const { title, src, style } = props;
    return <img ref={ref} src={src} id={title} alt={title} className={title} style={style} />;
});

export const ScaledUploadedPhoto = React.forwardRef((props, ref) => {
    const { src, style } = props;
    const title = "scaled-uploaded-photo";
    return <img ref={ref} src={src} id={title} alt={title} style={style} />;
});

export const Warning = () => {
    return (
        <div className="warning-container">
            <h2>Your face is tilted. Please upload a different photo.</h2>
        </div>
    );
};

export const AvatarAccessoryDisplay = (props) => {
    const { optionsArray, gender, parentStates } = props;
    const { faceWidth, topOfHead, isLoading, scalingRatio, headTiltAngle, chin, leftEyebrow, accessoryIndex } = parentStates;
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
                    const isBehindBody = key === 'accessory' && accessoryIndex < 2;
                    const isInFrontOfHair = key === 'accessory' && accessoryIndex === 2;
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
                            src={item.assets.getItem(item.index, gender)}
                            ref={item.ref}
                            style={style}
                        />
                    );
                })
            }
        </>
    );
};
