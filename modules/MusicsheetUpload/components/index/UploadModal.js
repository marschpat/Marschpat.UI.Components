import React from 'react';
import ProgressInfo from '../ProgressInfo';
import UploadSuccess from './UploadSuccess';
import LoadingModal from '@marschpat/Marschpat.UI.Components/components/LoadingModal';

const UploadModal = props => {
    const isUploading = !props.success && !props.hasError;

    return (
        <LoadingModal open={props.open}>
            {isUploading ? (
                <ProgressInfo
                    totalSize={props.totalSize}
                    progress={props.progress}
                    message="Einen Moment noch, Upload läuft..."
                    infoText="Beim digitalisieren deines Musikstücks generieren wir für unsere Geräte optimierte Versionen. Je nach Anzahl der Stimmen, Notenblätter pro Stimme und Dateigröße deiner original Dateien kann der Musikstück Upload einige Zeit in Anspruch nehmen. Bitte achte auf eine stabile Internetverbindung während des Uploads."
                />
            ) : (
                <UploadSuccess
                    hasError={props.hasError}
                    implementationMode={props.implementationMode}
                    handleUploaderReset={props.handleUploaderReset}
                    handleSubmitPayloadReset={props.handleSubmitPayloadReset}
                />
            )}
        </LoadingModal>
    );
}

export default UploadModal;
