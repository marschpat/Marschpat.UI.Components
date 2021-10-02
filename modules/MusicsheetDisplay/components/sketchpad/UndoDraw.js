import React from 'react';
import UndoIcon from '@material-ui/icons/Undo';
import IconButton from '@material-ui/core/IconButton';

const UndoDraw = () => {
    return (
        <IconButton className="ml-24" aria-label="undo" size="large">
            <UndoIcon fontSize="inherit" />
        </IconButton>
    );
};

export default UndoDraw;
