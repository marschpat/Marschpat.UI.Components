import React, { useState } from 'react';
import axios from 'axios';

function useFetchMusicsheetPages() {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [musicsheetPages, setMusicsheetPages] = useState([]);

    async function fetchMusicsheetPages(sheetId, voiceId) {
        setIsLoading(true);
        const { success, data } = await fetchAllMusicsheetVoicePages(sheetId, voiceId);
        if (success) {
            setMusicsheetPages(data);
        }
        setIsLoading(false);
    }

    async function fetchAllMusicsheetVoicePages(sheetId, voiceId, type = 'rendered') {
        try {
            const response = await axios.post(
                `musiclibrary/${sheetId}/download/${voiceId}/?type=${type}`
            );
            const success = response?.data ? true : false;
            const data = success ? response.data : 'invalid API response (no data)';

            return { success, data };
        } catch (error) {
            const errorMsg = error?.response?.data?.message;
            setHasError(errorMsg);
            console.error('Error while fechtching musicsheet downloadLink occured:', errorMsg);
            setIsLoading(false);

            return { success: false, data: errorMsg };
        }
    }

    return { fetchMusicsheetPages, musicsheetPages, isLoading, hasError, setHasError };
}

export default useFetchMusicsheetPages;
