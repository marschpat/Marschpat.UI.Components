import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import Loading from './components/Loading';
import LoadingError from './components/LoadingError';
import useDefaultVoices from './utils/useDefaultVoices';
import MusicsheetDialog from './components/MusicsheetDialog';
import { MusicsheetLoaderContext } from './context/MusicsheetDisplayContexts';
import { apiRoutes } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';

import i18next from 'i18next';
import en from './musicSheetDisplay-i18n/en';
import de from './musicSheetDisplay-i18n/de';
import { useTranslation } from 'react-i18next';
i18next.addResourceBundle('en', 'msd', en);
i18next.addResourceBundle('de', 'msd', de);
/**
 * Loads musicsheet meta data.
 * Handles errors if musicsheet doesn't exist.
 * Finds the default InstrumentVoice (if not passed as url param).
 */
const MusicsheetLoader = ({ implementationMode }) => {
    const { t } = useTranslation(['msd']);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [instrumentVoice, setInstrumentVoice] = useState(null);
    const [musicsheetMetaData, setMusicsheetMetaData] = useState(null);
    const [allowLayerCreation, setAllowLayerCreation] = useState(false);
    const { findDefaultVoice, voiceFromId } = useDefaultVoices();
    const { sheetId, voiceId = 0 } = useParams();

    /**
     * Fetch the musicsheet's meta data information and
     * find the default instrument voice (if no voiceId provided as url param)
     */
    useEffect(() => {
        setIsLoading(true);
        async function fetchData() {
            const { success, data } = await fetchMusicsheetMetaData(sheetId);
            if (success) {
                setMusicsheetMetaData(data);
                setIsLoading(false);
            }
            if (!success) handleLoadingError(data);
        }
        fetchData();
    }, [sheetId, voiceId]);

    useEffect(() => {
        if (musicsheetMetaData) {
            const voice = voiceId
                ? voiceFromId(musicsheetMetaData, voiceId)
                : findDefaultVoice(musicsheetMetaData);
            if (!voice) {
                setHasError(t('MSD_ERROR_NOVOICE'));
            }
            if (voice) {
                setInstrumentVoice(voice);
            }
        }
    }, [musicsheetMetaData, voiceId]);

    return (
        <MusicsheetLoaderContext.Provider
            value={{
                musicsheetMetaData,
                instrumentVoice,
                setInstrumentVoice,
                implementationMode,
                allowLayerCreation,
                setAllowLayerCreation,
            }}
        >
            {musicsheetMetaData && instrumentVoice && <MusicsheetDialog />}

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
            const data = success ? response.data : t('MSD_ERROR_NORESPONSE');

            return { success, data };
        } catch (error) {
            const errorMsg = error?.response?.data?.message ?? error?.response?.data?.title;
            console.error('Error while fechtching musicsheet information occured:', errorMsg);
            return { success: false, data: errorMsg };
        }
    }

    function handleLoadingError(error = true) {
        setIsLoading(false);
        setHasError(error);
    }
};

export default MusicsheetLoader;
