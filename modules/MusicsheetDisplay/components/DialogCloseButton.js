import React, { useContext } from 'react';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { MusicsheetDisplayContext } from '../context/MusicsheetDisplayContexts';

const DialogCloseButton = ({ variant }) => {
    const { closeDialog } = useContext(MusicsheetDisplayContext);

    return (
        <Tooltip title="Notenblatt Ansicht schließen">
            <IconButton onClick={closeDialog} edge="start" color="inherit" aria-label="back">
                <Icon>{variant === 'arrow' ? 'arrow_back' : 'close'}</Icon>
            </IconButton>
        </Tooltip>
    );
};

export default DialogCloseButton;
