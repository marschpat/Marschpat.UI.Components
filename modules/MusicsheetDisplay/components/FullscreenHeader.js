import React from 'react';
import CarouselFullscreenButton from './CarouselFullscreenButton';
import LayersSelect from './sketchpad/LayersSelect';
import DialogCloseButton from './DialogCloseButton';
import MusicsheetTitleInfo from './MusicsheetTitleInfo';
import InstrumentVoiceInfo from './InstrumentVoiceInfo';
import ToggleSketchpadButton from './ToggleSketchpadButton';
import InstrumentVoiceSelector from './InstrumentVoiceSelector';
import TogglePagesPreviewButton from './TogglePagesPreviewButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

const FullscreenHeader = ({ inPlaylist }) => {
    return (
        <AppBar>
            <Toolbar>
                <div className="w-full md:flex md:justify-between md:items-center">
                    <div className="flex items-center">
                        <DialogCloseButton variant="arrow" />
                        <MusicsheetTitleInfo />
                        <InstrumentVoiceInfo />
                    </div>
                    <div className="flex-1 flex items-center md:justify-center">
                        <ToggleSketchpadButton />
                        <LayersSelect />
                    </div>
                    <div className="flex items-center justify-end">
                        {inPlaylist && (
                            <div className="mr-20">
                                <Tooltip title="Zum vorherigen Stück in Playlist ${}">
                                    <IconButton
                                        // onClick={() => setIsCarouselFullscreen(prev => !prev)}
                                        edge="start"
                                        color="inherit"
                                        aria-label="previous musicsheet in playlist"
                                    >
                                        <SkipPreviousIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Zum nächsten Stück in Playlist ${}">
                                    <IconButton
                                        // onClick={() => setIsCarouselFullscreen(prev => !prev)}
                                        edge="start"
                                        color="inherit"
                                        aria-label="next musicsheet in playlist"
                                    >
                                        <SkipNextIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        )}

                        <CarouselFullscreenButton />
                        <TogglePagesPreviewButton />
                        <InstrumentVoiceSelector />
                        <DialogCloseButton />
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default FullscreenHeader;
