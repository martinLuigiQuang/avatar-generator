import * as React from 'react';
import Button from '@material-ui/core/Button';
import ApplicationConstants from '../data/constants';

const AvatarButtons = (props) => {
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

export default AvatarButtons;
