import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import { apiRoutes } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';

const MusicsheetPagesLoader = props => {
    const {
        musicsheetMetaData: musicsheet,
        instrumentVoice: voice,
        handleLoadingError,
        handleMusicsheetPagesLoaded,
        implementationMode,
        setIsLoading,
    } = useContext(MusicsheetLoaderContext);
    const [downloadLinks, setDownloadLinks] = useState(null);

    useEffect(() => {
        if (musicsheet && voice) {
            async function fetchData() {
                setIsLoading(true);
                const { success, data } = await fetchAllMusicsheetVoicePages(
                    musicsheet.sheetID,
                    voice.voiceID
                );
                if (success) {
                    setDownloadLinks(data);
                }
                if (!success) {
                    handleLoadingError(data);
                }
            }
            fetchData();
        }
    }, [musicsheet, voice]);

    useEffect(() => {
        if (downloadLinks) {
            handleMusicsheetPagesLoaded(downloadLinks);
        }
        setIsLoading(false);
    }, [downloadLinks]);

    async function fetchAllMusicsheetVoicePages(sheetId, voiceId = 0, type = 'rendered') {
        try {
            const response = await axios.post(
                `${apiRoutes[implementationMode].musiclibrary}/${sheetId}/download/${voiceId}/?type=${type}`
            );
            const success = response?.data ? true : false;
            const data = success ? response.data : 'invalid API response (no data)';

            return { success, data };
        } catch (error) {
            const errorMsg = error?.response?.data?.message;
            console.error('Error while fechtching musicsheet downloadLink occured:', errorMsg);

            return { success: false, data: errorMsg };
        }
    }

    return downloadLinks && props.children;
};

export default MusicsheetPagesLoader;
