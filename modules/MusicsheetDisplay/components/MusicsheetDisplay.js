import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Loading from './Loading';
import Sketchpad from './sketchpad/Sketchpad';
import FullscreenHeader from './FullscreenHeader';
import MusicsheetGalleryWithSketchpadLayers from './MusicsheetGalleryWithSketchpadLayers';
import useDispatchFlashMessage from '@marschpat/local/utils/useDispatchFlashMessage';
import {
    MusicsheetDisplayContext,
    MusicsheetLoaderContext,
} from '../context/MusicsheetDisplayContexts';
import {
    apiRoutes,
    MP_EDU,
} from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';

const MusicsheetDisplay = props => {
    const user = props.user;
    const organisation = props.organisation;
    const [viewMode, setViewMode] = useState('view');
    const [inPlaylist, setInPlaylist] = useState(null);
    const [showPagesPreview, setShowPagesPreview] = useState(true);
    const [isCarouselFullscreen, setIsCarouselFullscreen] = useState(false);
    const [sketchpadLayers, setSketchpadLayers] = useState([]);
    const dispatchFlashMessage = useDispatchFlashMessage();
    const { musicsheetMetaData, instrumentVoice, implementationMode, isLoading, allowLayerCreation, setAllowLayerCreation } =
        useContext(MusicsheetLoaderContext);
    const withSketchpadFeature = true;
    // const withSketchpadFeature = implementationMode === MP_EDU ? true : false;
    const voiceId = instrumentVoice.voiceId;
    const sheetId = musicsheetMetaData.sheetId;

    useEffect(() => {
        if(musicsheetMetaData.isPrivate) {
            if(musicsheetMetaData.ownerType == 'Organisation') {
                let member = organisation.members.find(x => x.userId == user.userId);
                setAllowLayerCreation(member && member.isAdmin);
            }
            else if(musicsheetMetaData.ownerType == 'PrivateUser') {
                setAllowLayerCreation(musicsheetMetaData.ownerId == user.userId);
            }
        }
    }, [musicsheetMetaData])

    useEffect(() => {
        async function fetchData() {
            await initializeFromQueryParams();
            if (withSketchpadFeature) {
                await fetchSketchpadLayers();
            }
        }
        fetchData();
    }, [sheetId, voiceId]);

    function initializeLayers(layers) {
        return layers.map(item => ({ ...item, active: false }));
    }

    function toggleViewMode() {
        setViewMode(prev => (prev === 'view' ? 'sketchpad' : 'view'));
    }

    async function fetchSketchpadLayers() {
        const url = `${apiRoutes[implementationMode].musiclibrary}/sketchpad/${sheetId}/${voiceId}`;
        await axios
            .get(url)
            .then(response => {
                const layersInit = initializeLayers(response.data);
                setSketchpadLayers(layersInit);
            })
            .catch(error => {
                dispatchFlashMessage("Fehler beim Laden der Notizen.");
            });
    }

    async function persistSketchpadLayerInDb(layer) {
        await axios
            .post(
                `${apiRoutes[implementationMode].musiclibrary}/sketchpad/${layer.sheetId}/${layer.voiceId}`,
                layer
            )
            .then(response => {
                dispatchFlashMessage("Notiz gespeichert :)", 'success');
            })
            .catch(error => {
                dispatchFlashMessage("Fehler beim Speichern der Notiz, bitte probieren Sie es erneut.");
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
                dispatchFlashMessage("Fehler beim Laden der Playlist, bitte versuchen Sie es erneut.");
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
            <FullscreenHeader
                musicsheetId={sheetId}
                inPlaylist={inPlaylist}
                withSketchpadFeature={withSketchpadFeature}
                allowLayerCreation={allowLayerCreation}
            />

            <div className="mt-160 sm:mt-136 md:mt-48 w-full">
                {/* render "normal" VIEW view mode */}
                {viewMode === 'view' && !isLoading && <MusicsheetGalleryWithSketchpadLayers />}

                {/* render SKETCHPAD view mode */}
                {viewMode === 'sketchpad' && !isLoading && <Sketchpad />}

                {isLoading && (
                    <div className="mt-160">
                        <Loading />
                    </div>
                )}
            </div>
        </MusicsheetDisplayContext.Provider>
    );

    function initializeFromQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const playlistId = urlParams.get('pl');
        if (playlistId) {
            initializeWithPlaylist(playlistId);
        }
        const mode = urlParams.get('mode');
        if (withSketchpadFeature && mode === 'sketchpad') {
            setViewMode('sketchpad');
        }
    }

    function initializeWithPlaylist(id) {
        const couldBeValidId = /^\d*$/.test(id);
        if (!couldBeValidId) return false;

        fetchPlaylist(id);
    }
};

export default MusicsheetDisplay;
