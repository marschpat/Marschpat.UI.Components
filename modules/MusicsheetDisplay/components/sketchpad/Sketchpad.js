import React, { useContext, useEffect, useState } from 'react';
import SketchpadPage from './SketchpadPage';
import LayerControls from './LayerControls';
import SketchpadLayerBlank from '../sketchpad/SketchpadLayerBlank';
import { SketchpadContext } from '../../context/SketchpadContexts';
import { MusicsheetLoaderContext } from '../../context/MusicsheetDisplayContexts';

const Sketchpad = () => {
    const { musicsheetPages: pages, musicsheetMetaData, instrumentVoice } = useContext(MusicsheetLoaderContext);
    const [sketchpadLayers, setSketchpadLayers] = useState([]);
    const [isCreateActive, setIsCreateActive] = useState(false);

    useEffect(() => {
        // @ToDo Fetch all layers for this sheetId & voiceId
        console.log('...fetching');
        const layers = require('../../layers.example.js');
        const layersInit = initializeLayers(layers);
        setSketchpadLayers(layersInit);
    }, []);

    function initializeLayers(layers) {
        return layers.map(item => ({ ...item, active: false }));
    }

    return (
        <SketchpadContext.Provider
            value={{
                sketchpadLayers,
                setSketchpadLayers,
                isCreateActive,
                setIsCreateActive,
            }}
        >
            <SketchpadLayerBlank sheetId={musicsheetMetaData.sheetID} voiceId={instrumentVoice.voiceID}>
                <LayerControls />
                {pages.map((page, index) => (
                    <SketchpadPage page={page} key={index} />
                ))}
            </SketchpadLayerBlank>
        </SketchpadContext.Provider>
    );
};

export default Sketchpad;
