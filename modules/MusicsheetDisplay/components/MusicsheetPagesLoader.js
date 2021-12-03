import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MusicsheetPagesLoader = ({
    children,
    sheetId,
    voiceId,
    setIsLoading,
    handleMusicsheetPagesLoaded,
    handleLoadingError,
}) => {
    const [downloadLinks, setDownloadLinks] = useState(null);

    useEffect(() => {
        if (sheetId && voiceId) {
            async function fetchData() {
                setIsLoading(true);
                const { success, data } = await fetchAllMusicsheetVoicePages(sheetId, voiceId);
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
