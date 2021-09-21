import React, { useContext } from 'react';
import { MusicsheetDisplayContext } from '../context/MusicsheetDisplayContexts';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

const CarouselFullscreenButton = () => {
    const { isCarouselFullscreen, setIsCarouselFullscreen } = useContext(MusicsheetDisplayContext);

    return (
        <Tooltip title="Notenblatt Vollbild">
            <IconButton
                onClick={() => setIsCarouselFullscreen(prev => !prev)}
                edge="start"
                color="inherit"
                aria-label="Musicsheet Fullscreen"
            >
                {isCarouselFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default CarouselFullscreenButton;
