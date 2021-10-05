import React from 'react';
import PlaylistControls from './PlaylistControlls';
import LayersSelect from './sketchpad/LayersSelect';
import DialogCloseButton from './DialogCloseButton';
import MusicsheetTitleInfo from './MusicsheetTitleInfo';
import InstrumentVoiceInfo from './InstrumentVoiceInfo';
import ToggleSketchpadButton from './ToggleSketchpadButton';
import InstrumentVoiceSelector from './InstrumentVoiceSelector';
import CarouselFullscreenButton from './CarouselFullscreenButton';
import TogglePagesPreviewButton from './TogglePagesPreviewButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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
                        {inPlaylist && <PlaylistControls inPlaylist={inPlaylist} />}
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
