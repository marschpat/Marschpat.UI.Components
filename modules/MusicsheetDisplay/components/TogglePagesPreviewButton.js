import React, { useContext } from 'react';
import { MusicsheetDisplayContext } from '../context/MusicsheetDisplayContexts';
import IconButton from '@material-ui/core/IconButton';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';

const TogglePagesPreviewButton = () => {
    const { t } = useTranslation(['msd']);
    const { setShowPagesPreview } = useContext(MusicsheetDisplayContext);

    return (
        <Tooltip title={t('MSD_SHOW_PAGES_TTP')}>
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
