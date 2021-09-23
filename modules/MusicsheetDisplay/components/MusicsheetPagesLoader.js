import { React, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';

const MusicsheetPagesLoader = props => {
    const { musicsheetMetaData: musicsheet, instrumentVoice: voice } = useContext(MusicsheetLoaderContext);
    const [downloadLinks, setDownloadLinks] = useState(null);

    useEffect(async () => {
        if (musicsheet && voice) {
            const { success, data } = await fetchAllMusicsheetVoicePages(musicsheet.sheetID, voice.voiceID);
            if (success) {
                setDownloadLinks(data);
            }
            if (!success) {
                props.handleError(data);
            }
        }
    }, [musicsheet, voice]);

    useEffect(() => {
        if (downloadLinks) {
            props.handleMusicsheetPagesLoaded(downloadLinks);
        }
    }, [downloadLinks]);

    async function fetchAllMusicsheetVoicePages(sheetId, voiceId = 0, type = 'rendered') {
        try {
            const response = await axios.post(`/musiclibrary/${sheetId}/download/${voiceId}/?type=${type}`);
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
