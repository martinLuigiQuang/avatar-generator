import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import ApplicationConstants from '../data/constants';

const DEFAULT_SIZE = 25;

const LoadingSpinner = (props) => {
    const { size, height } = props;
    return (
        <span 
            className="spinner-container"
            style={{ 
                zIndex: ApplicationConstants.Z_INDEX_SPINNER,
                height 
            }}
        >
            <CircularProgress size={size || DEFAULT_SIZE} />
        </span>
    );
};

export default LoadingSpinner;
