import React, { useContext } from 'react';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { MusicsheetDisplayContext } from '../context/MusicsheetDisplayContexts';
import { useTranslation } from 'react-i18next';

const DialogCloseButton = ({ variant }) => {
    const { t } = useTranslation(['msd']);
    const { closeDialog } = useContext(MusicsheetDisplayContext);

    return (
        <Tooltip title={t('MSD_CLOSE_TTP')}>
            <IconButton
                data-tour={variant === 'arrow' ? '' : 'tour_musiclibraryheaderexit'}
                onClick={closeDialog}
                color="inherit"
                aria-label="back"
            >
                <Icon>{variant === 'arrow' ? 'arrow_back' : 'close'}</Icon>
            </IconButton>
        </Tooltip>
    );
};

export default DialogCloseButton;
