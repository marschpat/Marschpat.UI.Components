import React from 'react';
import UndoIcon from '@material-ui/icons/Undo';
import IconButton from '@material-ui/core/IconButton';

const UndoDraw = props => {
    return (
        <IconButton onClick={props.handleUndoDraw} className="ml-24" aria-label="undo">
            <UndoIcon fontSize="inherit" />
        </IconButton>
    );
};

export default UndoDraw;
