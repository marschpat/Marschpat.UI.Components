import React, { useContext } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const CloseButton = ({ onClick }) => {
    const handleClick = () => {
        onClick();
    };

    return (
        <IconButton aria-label="delete" className="flex-shrink-0" onClick={handleClick}>
            <CloseIcon />
        </IconButton>
    );
};

export default CloseButton;
