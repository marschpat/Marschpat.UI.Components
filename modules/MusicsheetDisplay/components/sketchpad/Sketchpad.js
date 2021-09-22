import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import SketchpadPage from './SketchpadPage';
import LayerControls from './LayerControls';
import SketchpadLayerBlank from '../sketchpad/SketchpadLayerBlank';
import { SketchpadContext } from '../../context/SketchpadContexts';
import { MusicsheetLoaderContext } from '../../context/MusicsheetDisplayContexts';

const Sketchpad = () => {
    const { musicsheetPages: pages, musicsheetMetaData, instrumentVoice } = useContext(MusicsheetLoaderContext);
    const [sketchpadLayers, setSketchpadLayers] = useState([]);
    const [isCreateActive, setIsCreateActive] = useState(false);
    const voiceId = instrumentVoice.voiceID;
    const sheetId = musicsheetMetaData.sheetID;

    useEffect(() => {
        // @ToDo Fetch all layers for this sheetId & voiceId
        fetchSketchpadLayers();
        const layers = require('../../layers.example.js');
        const layersInit = initializeLayers(layers);
        setSketchpadLayers(layersInit);
    }, []);

    function initializeLayers(layers) {
        return layers.map(item => ({ ...item, active: false }));
    }

    function fetchSketchpadLayers() {
        console.log('fetching sketchpad layers', { sheetId, voiceId });
        const url = `/musiclibrary/sketchpad/${sheetId}/${voiceId}`;
        axios
            .get(url)
            .then(response => {
                console.log('fetched sketchpad layers', response);
            })
            .catch(error => {
                console.error(`Fetching sketchpad layers from ${url} failed with an error.`, error);
            });
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
            <SketchpadLayerBlank sheetId={sheetId} voiceId={voiceId}>
                <LayerControls />
                {pages.map((page, index) => (
                    <SketchpadPage page={page} key={index} />
                ))}
            </SketchpadLayerBlank>
        </SketchpadContext.Provider>
    );
};

export default Sketchpad;
