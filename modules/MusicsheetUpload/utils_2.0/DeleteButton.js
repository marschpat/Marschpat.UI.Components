import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const CloseButton = ({ onClick }) => {
    const handleClick = () => {
        onClick();
    };

    return (
        <IconButton aria-label="close" className="flex-shrink-0" onClick={handleClick}>
            <DeleteIcon className="text-grey-800" />
        </IconButton>
    );
};

export default CloseButton;
