import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import { apiRoutes } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';

const MusicsheetPagesLoader = ({
    children,
    sheetId,
    voiceId,
    handleMusicsheetPagesLoaded,
    handleLoadingError,
}) => {
    // const {
    //     musicsheetMetaData: musicsheet,
    //     instrumentVoice: voice,
    //     handleLoadingError,
    //     handleMusicsheetPagesLoaded,
    //     implementationMode,
    //     setIsLoading,
    // } = useContext(MusicsheetLoaderContext);
    const [downloadLinks, setDownloadLinks] = useState(null);

    useEffect(() => {
        console.log('MusicsheetPagesLoader sheet and or voice changed', { sheetId, voiceId });
        if (sheetId && voiceId) {
            async function fetchData() {
                const { success, data } = await fetchAllMusicsheetVoicePages(sheetId, voiceId);
                console.log('okay, what happens? ', { success, data });
                if (success) {
                    setDownloadLinks(data);
                    handleMusicsheetPagesLoaded(data);
                }
                if (!success) {
                    handleLoadingError(data);
                }
            }
            fetchData();
        }
    }, [sheetId, voiceId]);

    async function fetchAllMusicsheetVoicePages(sheetId, voiceId = 0, type = 'rendered') {
        console.log('kay?', `musiclibrary/${sheetId}/download/${voiceId}/?type=${type}`);
        try {
            const response = await axios.post(
                `musiclibrary/${sheetId}/download/${voiceId}/?type=${type}`
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

    return downloadLinks && children;
};

export default MusicsheetPagesLoader;
