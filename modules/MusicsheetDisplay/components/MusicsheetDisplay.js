import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Sketchpad from './sketchpad/Sketchpad';
import FullscreenHeader from './FullscreenHeader';
import MusicsheetPageImageCarousel from './MusicsheetPageImageCarousel';
import { MusicsheetDisplayContext, MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';

const MusicsheetDisplay = props => {
    const [viewMode, setViewMode] = useState('view');
    const [showPagesPreview, setShowPagesPreview] = useState(true);
    const [isCarouselFullscreen, setIsCarouselFullscreen] = useState(false);
    const [sketchpadLayers, setSketchpadLayers] = useState([]);
    const { musicsheetPages: pages, musicsheetMetaData, instrumentVoice } = useContext(MusicsheetLoaderContext);
    const voiceId = instrumentVoice.voiceID;
    const sheetId = musicsheetMetaData.sheetID;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        if (modeParam === 'sketchpad') {
            setViewMode('sketchpad');
        }

        // fetch sketchpad layers
        fetchSketchpadLayers();
        const layers = require('../layers.example.js');
        const layersInit = initializeLayers(layers);
        setSketchpadLayers(layersInit);

        console.log('my sketchpad layers?', layersInit);
    }, []);

    function initializeLayers(layers) {
        return layers.map(item => ({ ...item, active: false }));
    }

    function toggleViewMode() {
        setViewMode(prev => (prev === 'view' ? 'sketchpad' : 'view'));
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

    function persistSketchpadLayer(layer) {
        console.log('persisting layer', layer);
        axios
            .post(`/musiclibrary/sketchpad/${layer.sheetId}/${layer.voiceId}`)
            .then(response => {
                console.log('okay! sketchpad layer persisted', response);
            })
            .catch(error => {
                console.error(`Persisting sketchpad layer failed with an error.`, error);
            });
    }

    return (
        <MusicsheetDisplayContext.Provider
            value={{
                closeDialog: props.handleClose,
                viewMode,
                toggleViewMode,
                isCarouselFullscreen,
                setIsCarouselFullscreen,
                showPagesPreview,
                setShowPagesPreview,
                sketchpadLayers,
                setSketchpadLayers,
                persistSketchpadLayer,
            }}
        >
            <FullscreenHeader />

            <div className="mt-48 w-full">
                {/* render "normal" VIEW view mode */}
                {viewMode === 'view' && <MusicsheetPageImageCarousel />}

                {/* render SKETCHPAD view mode */}
                {viewMode === 'sketchpad' && <Sketchpad />}
            </div>
        </MusicsheetDisplayContext.Provider>
    );
};

export default MusicsheetDisplay;
