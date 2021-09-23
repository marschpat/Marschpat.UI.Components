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

const FullscreenHeader = () => {
    return (
        <AppBar>
            <Toolbar>
                <div className="w-full flex justify-between items-center">
                    <div className="flex items-center">
                        <DialogCloseButton variant="arrow" />
                        <MusicsheetTitleInfo />
                        <InstrumentVoiceInfo />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <ToggleSketchpadButton />
                        <LayersSelect />
                    </div>
                    <div className="flex items-center">
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
