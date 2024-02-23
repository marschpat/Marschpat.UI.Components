import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressInfo from '../ProgressInfo';
import useUploadProgress from '../../utils/useUploadProgress';
import LoadingModal from '@marschpat/Marschpat.UI.Components/components/LoadingModal';
import { useTranslation } from 'react-i18next';

const DownloadEditData = props => {
    const { t } = useTranslation(['uploader']);
    const [isDownloading, setIsDownloading] = useState(props.sheetId ? true : false);
    const [uploadProgress, totalUploadSize, handleUploadProgress] = useUploadProgress();

    const fetchMusicsheetEditData = dlUrl => {
        axios
            .get(dlUrl, {
                transformRequest: (data, headers) => {
                    delete headers.common['Authorization'];
                },
                onDownloadProgress: handleUploadProgress,
            })
            .then(response => {
                const rawEditData = response.data ?? null;
                props.handleMusicsheetEditData(rawEditData);
            })
            .catch(error => {
                console.error(
                    `Fetching musicsheet edit data from GET ${dlUrl} failed with an error.`,
                    error
                );
            });
    };

    const downloadEditData = sheetId => {
        const path = `v1/musicsheet-upload/${sheetId}`;
        axios
            .get(path)
            .then(response => {
                const path = response.data?.link ?? null;
                if (path) fetchMusicsheetEditData(path);
            })
            .catch(error => {
                console.error(
                    `Fetching musicsheet edit data from GET ${path} failed with an error.`,
                    error
                );
                props.abort();
            });
    };

    useEffect(() => {
        downloadEditData(props.sheetId);
    }, []);

    return (
        isDownloading && (
            <LoadingModal open={isDownloading}>
                <ProgressInfo
                    totalSize={totalUploadSize}
                    progress={uploadProgress}
                    description={t('UPLOADER_DOWNLOAD_STATUS')}
                    message={t('UPLOADER_DOWNLOAD_INPROGESS')}
                    infoText={t('UPLOADER_DOWNLOAD_INPROGESS_DESC')}
                />
            </LoadingModal>
        )
    );
};

export default DownloadEditData;
