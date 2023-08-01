import React from 'react';
import ProgressInfo from '../ProgressInfo';
import UploadSuccess from './UploadSuccess';
import LoadingModal from '@marschpat/Marschpat.UI.Components/components/LoadingModal';
import { useTranslation } from 'react-i18next';

const UploadModal = props => {
    const { t } = useTranslation(['uploader']);
    const isUploading = !props.success && !props.hasError;

    return (
        <LoadingModal open={props.open}>
            {isUploading ? (
                <ProgressInfo
                    totalSize={props.totalSize}
                    progress={props.progress}
                    message={t('UPLOADER_UPLOAD_INPROGESS')}
                    infoText={t('UPLOADER_UPLOAD_INPROGESS_DESC')}
                />
            ) : (
                <UploadSuccess
                    hasError={props.hasError}
                    handleSubmitPayloadReset={props.handleSubmitPayloadReset}
                />
            )}
        </LoadingModal>
    );
};

export default UploadModal;
