import React, { useContext } from 'react';
import { MusicsheetDisplayContext } from '../context/MusicsheetDisplayContexts';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { useTranslation } from 'react-i18next';

const CarouselFullscreenButton = () => {
    const { t } = useTranslation(['msd']);
    const { isCarouselFullscreen, setIsCarouselFullscreen } = useContext(MusicsheetDisplayContext);

    return (
        <Tooltip title={t('MSD_FULLSCREEN_TTP')}>
            <IconButton
                onClick={() => setIsCarouselFullscreen(prev => !prev)}
                color="inherit"
                aria-label="Musicsheet Fullscreen"
            >
                {isCarouselFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default CarouselFullscreenButton;
