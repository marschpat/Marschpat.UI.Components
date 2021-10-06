import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Sketchpad from './sketchpad/Sketchpad';
import FullscreenHeader from './FullscreenHeader';
import MusicsheetGalleryWithSketchpadLayers from './MusicsheetGalleryWithSketchpadLayers';
import { MusicsheetDisplayContext, MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';

const MusicsheetDisplay = props => {
    const [viewMode, setViewMode] = useState('view');
    const [inPlaylist, setInPlaylist] = useState(null);
    const [showPagesPreview, setShowPagesPreview] = useState(true);
    const [isCarouselFullscreen, setIsCarouselFullscreen] = useState(false);
    const [sketchpadLayers, setSketchpadLayers] = useState([]);
    const { musicsheetPages: pages, musicsheetMetaData, instrumentVoice } = useContext(MusicsheetLoaderContext);
    const voiceId = instrumentVoice.voiceId;
    const sheetId = musicsheetMetaData.sheetID;

    useEffect(async () => {
        await initializeFromQueryParams();
        await fetchSketchpadLayers();

        const layers = require('../layers.example.js');
        const layersInit = initializeLayers(layers);

        setSketchpadLayers(layersInit);
    }, [sheetId]);

    function initializeLayers(layers) {
        return layers.map(item => ({ ...item, active: false }));
    }

    function toggleViewMode() {
        setViewMode(prev => (prev === 'view' ? 'sketchpad' : 'view'));
    }

    async function fetchSketchpadLayers() {
        console.log('fetching sketchpad layers', { sheetId, voiceId });
        const url = `/musiclibrary/sketchpad/${sheetId}/${voiceId}`;
        await axios
            .get(url)
            .then(response => {
                console.log('fetched sketchpad layers', response);
            })
            .catch(error => {
                console.error(`Fetching sketchpad layers from ${url} failed with an error.`, error);
            });
    }

    async function persistSketchpadLayerInDb(layer) {
        console.log('persisting layer', layer);
        await axios
            .post(`/musiclibrary/sketchpad/${layer.sheetId}/${layer.voiceId}`)
            .then(response => {
                console.log('okay! sketchpad layer persisted', response);
            })
            .catch(error => {
                console.error(`Persisting sketchpad layer failed with an error.`, error);
            });
    }

    async function fetchPlaylist(playlistId) {
        await axios
            .get(`/playlist/${playlistId}`)
            .then(response => {
                if (!response.data) return false;
                setInPlaylist(response.data);
            })
            .catch(error => {
                console.error(`Fetching playlist ${playlistId} falied with an error.`, error);
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
                persistSketchpadLayerInDb,
            }}
        >
            <FullscreenHeader musicsheetId={sheetId} inPlaylist={inPlaylist} />

            <div className="mt-160 sm:mt-136 md:mt-48 w-full">
                {/* render "normal" VIEW view mode */}
                {viewMode === 'view' && <MusicsheetGalleryWithSketchpadLayers />}

                {/* render SKETCHPAD view mode */}
                {viewMode === 'sketchpad' && <Sketchpad />}
            </div>
        </MusicsheetDisplayContext.Provider>
    );

    function initializeFromQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const playlistId = urlParams.get('pl');
        if (mode === 'sketchpad') {
            setViewMode('sketchpad');
        }
        if (playlistId) {
            initializeWithPlaylist(playlistId);
        }
    }

    function initializeWithPlaylist(id) {
        const couldBeValidId = /^\d*$/.test(id);
        if (!couldBeValidId) return false;

        fetchPlaylist(id);
    }
};

export default MusicsheetDisplay;
