import React from 'react';
import PlaylistControls from './PlaylistControls';
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

function FullscreenHeader(props) {
    return (
        <AppBar>
            <Toolbar>
                <div
                    data-tour="tour_musiclibraryheader"
                    className="w-full md:flex md:justify-between md:items-center"
                >
                    <div className="flex items-center">
                        <DialogCloseButton variant="arrow" />
                        <MusicsheetTitleInfo />
                        <InstrumentVoiceInfo />
                    </div>
                    {props.withSketchpadFeature && (
                        <div className="flex-1 flex items-center md:justify-center">
                           {props.allowLayerCreation && (
                                <ToggleSketchpadButton />
                           )} 
                            <LayersSelect />
                        </div>
                    )}
                    <div className="flex items-center justify-end">
                        {props.inPlaylist && (
                            <PlaylistControls
                                musicsheetId={props.musicsheetId}
                                inPlaylist={props.inPlaylist}
                            />
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
}

export default FullscreenHeader;
