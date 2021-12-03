import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useDefaultVoices from '../utils/useDefaultVoices';

const MusicsheetPagesLoader = ({
    children,
    musicsheet,
    candidateVoiceId,
    setIsLoading,
    handleMusicsheetPagesLoaded,
    handleLoadingError,
}) => {
    const [downloadLinks, setDownloadLinks] = useState(null);
    const [current, setCurrent] = useState({ sheet: null, voice: null });
    const [findDefaultVoice, voiceFromId, isExistingVoice] = useDefaultVoices();

    useEffect(() => {
        if (musicsheet && candidateVoiceId) {
            async function fetchMusicsheetPages(voiceId) {
                setIsLoading(true);

                const { success, data } = await fetchAllMusicsheetVoicePages(
                    musicsheet.sheetId,
                    voiceId
                );
                if (success) {
                    setDownloadLinks(data);
                    setCurrent({ sheet: musicsheet.sheetId, voice: voiceId });
                    handleMusicsheetPagesLoaded(data);
                }
                if (!success) {
                    handleLoadingError(data);
                }
            }

            const voiceId = isExistingVoice(candidateVoiceId, musicsheet.voices)
                ? candidateVoiceId
                : findDefaultVoice(musicsheet).voiceId;

            if (musicsheet.sheetId !== current.sheet || voiceId !== current.voice) {
                fetchMusicsheetPages(voiceId);
            }
        }
    }, [musicsheet, candidateVoiceId]);

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
            console.error('Error while fechtching musicsheet downloadLink occured:', errorMsg);

            return { success: false, data: errorMsg };
        }
    }

    return downloadLinks && children;
};

export default MusicsheetPagesLoader;
