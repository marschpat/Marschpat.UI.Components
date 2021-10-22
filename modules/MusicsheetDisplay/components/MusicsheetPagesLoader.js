import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import { apiRoutes } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';

const MusicsheetPagesLoader = props => {
    const {
        musicsheetMetaData: musicsheet,
        instrumentVoice: voice,
        setHasError,
        handleMusicsheetPagesLoaded,
        implementationMode,
    } = useContext(MusicsheetLoaderContext);
    const [downloadLinks, setDownloadLinks] = useState(null);

    useEffect(() => {
        if (musicsheet && voice) {
            const { success, data } = await fetchAllMusicsheetVoicePages(
                musicsheet.sheetId,
                voice.voiceId
            );
            if (success) {
                setDownloadLinks(data);
            }
            if (!success) {
                setHasError(data);
            }
            fetchData();
        }
    }, [musicsheet, voice]);

    useEffect(() => {
        if (downloadLinks) {
            handleMusicsheetPagesLoaded(downloadLinks);
        }
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
