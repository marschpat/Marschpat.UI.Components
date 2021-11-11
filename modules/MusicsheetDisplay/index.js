import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import Loading from './components/Loading';
import LoadingError from './components/LoadingError';
import MusicsheetDialog from './components/MusicsheetDialog';
import MusicsheetPagesLoader from './components/MusicsheetPagesLoader';
import { MusicsheetLoaderContext } from './context/MusicsheetDisplayContexts';
import { apiRoutes } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';

/**
 * Loads musicsheet meta data.
 * Handles errors if musicsheet doesn't exist.
 * Finds the default InstrumentVoice (if not passed as url param).
 */
const MusicsheetLoader = ({ implementationMode }) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [instrumentVoice, setInstrumentVoice] = useState(null);
    const [musicsheetPages, setMusicsheetPages] = useState(null);
    const [musicsheetMetaData, setMusicsheetMetaData] = useState(null);
    const { sheetId, voiceId = 0 } = useParams();

    /**
     * Fetch the musicsheet's meta data information and
     * find the default instrument voice (if no voiceId provided as url param)
     */
    useEffect(() => {
        async function fetchData() {
            const { success, data } = await fetchMusicsheetMetaData(sheetId);
            if (success) {
                const voice = voiceId ? voiceFromId(data, voiceId) : findDefaultVoice(data);
                setMusicsheetMetaData(data);
                setInstrumentVoice(voice);
            }
            if (!success) handleLoadingError(data);
        }
        fetchData();
    }, [sheetId]);

    return (
        <MusicsheetLoaderContext.Provider
            value={{
                musicsheetMetaData,
                musicsheetPages,
                instrumentVoice,
                setInstrumentVoice,
                handleMusicsheetPagesLoaded,
                handleLoadingError,
                implementationMode,
            }}
        >
            <MusicsheetPagesLoader>
                <MusicsheetDialog />
            </MusicsheetPagesLoader>

            {/* while loading */}
            {isLoading && <Loading />}

            {/* when error occurs */}
            {hasError && <LoadingError errorMsg={hasError} />}
        </MusicsheetLoaderContext.Provider>
    );

    async function fetchMusicsheetMetaData(sheetId) {
        try {
            const response = await axios.get(
                `${apiRoutes[implementationMode].musiclibrary}/${sheetId}`
            );
            const success = response?.data ? true : false;
            const data = success ? response.data : 'invalid API response (no data)';

            return { success, data };
        } catch (error) {
            const errorMsg = error?.response?.data?.message ?? error?.response?.data?.title;
            console.error('Error while fechtching musicsheet information occured:', errorMsg);
            return { success: false, data: errorMsg };
        }
    }

    function handleMusicsheetPagesLoaded(pages) {
        setMusicsheetPages(pages);
        setIsLoading(false);
    }

    function handleLoadingError(error = true) {
        setIsLoading(false);
        setHasError(error);
    }

    // get the first voice that isn't one of our "excluded voices"
    // see https://github.com/marschpat/Marschpat.UI.Web/issues/587
    // if there's a "preferred voice" persisted in local storage, takte that one
    function findDefaultVoice(musicsheet) {
        if (localStorage.getItem('favVoice')) {
            const favVoice = JSON.parse(localStorage.getItem('favVoice'));
            return favVoice;
        }

        let defaultVoice = null;
        for (let i = 0; i < musicsheet.voices.length; i++) {
            const voice = musicsheet.voices[i];
            if (detectRenderType(voice) === 'rendered') {
                defaultVoice = voice;
                break;
            }
            if (detectRenderType(voice) === 'mxl' && isAllowedAsDefaultVoice(voice.voiceID)) {
                defaultVoice = voice;
                break;
            }
            defaultVoice = voice;
        }

        if (!defaultVoice) handleLoadingError('no default voice for musicsheet');

        return defaultVoice;
    }

    /**
     * Find the apropriate render type
     *
     * @param {*} voice
     * @param {*} type
     * @returns string
     */
    function detectRenderType(voice, type) {
        if (voice.mxlAvailable && type === 'mxl') {
            return type;
        }
        if (voice.renderedAvailable && type === 'rendered') {
            return type;
        }
        if (voice.mxlAvailable) {
            return 'mxl';
        }
        if (voice.renderedAvailable) {
            return 'rendered';
        }
    }

    /**
     * If possible don't select any of these defined voices as default
     *
     * @param {*} voiceId
     * @param {*} excludeVoiceIds
     * @returns boolean
     */
    function isAllowedAsDefaultVoice(voiceId, excludeVoiceIds = []) {
        const notDefaultIfOtherVoicesExist = [1, 2, 73, 74];

        return (
            !notDefaultIfOtherVoicesExist.includes(voiceId) && !excludeVoiceIds.includes(voiceId)
        );
    }

    /**
     * Return corresponding voice. If no voice with this voiceId exists, return default voice
     *
     * @param {object} musicsheet
     * @param {int} voiceId
     * @returns object
     */
    function voiceFromId(musicsheet, voiceId) {
        const voice = musicsheet.voices.find(voice => voice.voiceID === parseInt(voiceId));
        if (!voice) {
            return findDefaultVoice(musicsheet);
        }

        return voice;
    }
};

export default MusicsheetLoader;
