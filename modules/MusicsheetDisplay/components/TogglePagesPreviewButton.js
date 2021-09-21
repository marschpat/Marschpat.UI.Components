import React, { useContext } from 'react';
import { MusicsheetDisplayContext } from '../context/MusicsheetDisplayContexts';
import IconButton from '@material-ui/core/IconButton';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Tooltip from '@material-ui/core/Tooltip';

const TogglePagesPreviewButton = () => {
    const { setShowPagesPreview } = useContext(MusicsheetDisplayContext);

    return (
        <Tooltip title="Seiten ein/ausblenden">
            <IconButton
                onClick={() => setShowPagesPreview(prev => !prev)}
                edge="end"
                color="inherit"
                aria-label="close"
            >
                <MenuBookIcon />
            </IconButton>
        </Tooltip>
    );
};

export default TogglePagesPreviewButton;
