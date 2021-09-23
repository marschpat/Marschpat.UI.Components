import React, { useContext } from 'react';
import SketchpadPage from './SketchpadPage';
import LayerControls from './LayerControls';
import MusicsheetPagesLoader from '../MusicsheetPagesLoader';
import SketchpadLayerBlank from '../sketchpad/SketchpadLayerBlank';
import { MusicsheetLoaderContext } from '../../context/MusicsheetDisplayContexts';

const Sketchpad = () => {
    const { musicsheetPages, musicsheetMetaData, instrumentVoice } = useContext(MusicsheetLoaderContext);

    return (
        <MusicsheetPagesLoader>
            <SketchpadLayerBlank sheetId={musicsheetMetaData.sheetID} voiceId={instrumentVoice.voiceID}>
                <LayerControls />
                {musicsheetPages.map((page, index) => (
                    <SketchpadPage page={page} key={index} />
                ))}
            </SketchpadLayerBlank>
        </MusicsheetPagesLoader>
    );
};

export default Sketchpad;
