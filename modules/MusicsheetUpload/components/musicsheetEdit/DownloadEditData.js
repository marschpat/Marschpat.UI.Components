import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressInfo from '../ProgressInfo';
import useUploadProgress from '../../utils/useUploadProgress';
import LoadingModal from '@marschpat/Marschpat.UI.Components/components/LoadingModal';

const DownloadEditData = props => {
    const [isDownloading, setIsDownloading] = useState(props.sheetId ? true : false);
    const [uploadProgress, totalUploadSize, handleUploadProgress] = useUploadProgress();

    const fetchMusicsheetEditData = dlUrl => {
        axios.get(dlUrl, {
            transformRequest: (data, headers) => {
                delete headers.common['Authorization'];
            },
            onDownloadProgress: handleUploadProgress,
        }).then(response => {
            const rawEditData = response.data ?? null;
            props.handleMusicsheetEditData(rawEditData);
        }).catch(error => {
            console.error(`Fetching musicsheet edit data from GET ${dlUrl} failed with an error.`, error);
        });
    }

    const downloadEditData = sheetId => {
        const path = `/musicsheet-upload/${sheetId}`;
        axios.get(path)
            .then(response => {
                const path = response.data?.link ?? null;
                if (path) fetchMusicsheetEditData(path);
            })
            .catch(error => {
                console.error(`Fetching musicsheet edit data from GET ${path} failed with an error.`, error);
                props.abort();
            });
    }

    useEffect(() => {
        downloadEditData(props.sheetId);
    }, []);

    return isDownloading && (
        <LoadingModal open={isDownloading}>
            <ProgressInfo
                totalSize={totalUploadSize}
                progress={uploadProgress}
                description={'Download gesamt'}
                message="Einen Moment noch, Musikstück wird geladen..."
                infoText="Wir bereiten das Musikstück zur Bearbeitung auf. Dies kann ggf etwas Zeit in Anspruch nehmen. Bitte achte auf eine stabile Internetverbindung."
            />
        </LoadingModal>
    );
};

export default DownloadEditData;
