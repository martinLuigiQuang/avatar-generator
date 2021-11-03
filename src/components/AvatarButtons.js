import * as React from 'react';

const DECREASE_INDEX = '-';
const INCREASE_INDEX = '+';

const AvatarButtons = (props) => {
    const {
        value,
        handleClick
    } = props;
    return (
        <div className="buttons-container">
            <button onClick={handleClick} value={-1}>
                {DECREASE_INDEX}
            </button>
            <h2>{value}</h2>
            <button onClick={handleClick} value={1}>
                {INCREASE_INDEX}
            </button>
        </div>
    );
};

export default AvatarButtons;
