import { useState } from 'react';

const useUploadProgress = () => {
    const [uploadProgress, setUploadProgress] = useState(null);
    const [totalUploadSize, setSetTotalUploadSize] = useState(null);
    const handleUploadProgress = progressEvent => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setSetTotalUploadSize(progressEvent.total);
        setUploadProgress(progress);
    };

    return [uploadProgress, totalUploadSize, handleUploadProgress];
};

export default useUploadProgress;
