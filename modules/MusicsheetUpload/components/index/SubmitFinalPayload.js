import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadModal from './UploadModal';
import PersistFinalPayloadToFile from './PersistPayloadToFile';
import useUploadProgress from '../../utils/useUploadProgress';
import { getCompletionStatus } from '../../utils/InstrumentSheetsHelper';
import MusicsheetUploadResponse from '../../utils/MusicsheetUploadResponse';
import MusicsheetUploadApiAdapter from '../../utils/MusicsheetUploadApiAdapter';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';

const initialPayload = require('../../musicsheet.initial.json');

const SubmitFinalPayload = props => {
    const [finalPayload, setFinalPayload] = useState(initialPayload);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const inDebugMode = useInDebugMode();
    const dispatchFlashMessage = props.dispatchFlashMessage;
    const [uploadProgress, totalUploadSize, handleUploadProgress] = useUploadProgress();

    useEffect(() => updateMetaData(props.metaData), [props.metaData]);
    useEffect(() => updateUploadScope(props.uploadScope), [props.uploadScope]);
    useEffect(() => updateInstrumentSheets(props.instrumentSheets), [props.instrumentSheets]);
    useEffect(() => updateSheetId(props.sheetId), [props.sheetId]);

    // @ToDo: Sry for the mess, needs refactoring when all requirements are clear
    const submit = () => {
        if (props.errors && props.errors.length > 0) {
            dispatchFlashMessage('Erforderliche Grunddaten vollständig eingeben!', 'error');
            return;
        }
        if (!finalPayload.instrumentSheets || finalPayload.instrumentSheets.length < 1) {
            dispatchFlashMessage('Stimmen zum Upload auswählen!', 'error');
            return;
        }
        const allSheetsCompleted = finalPayload.instrumentSheets.every(sheet => {
            const [ completed ] = getCompletionStatus(sheet);
            return completed;
        });
        if (!allSheetsCompleted) {
            dispatchFlashMessage('Stimmen bearbeiten und Instrumentenstimmen zuordnen!', 'error');
            return;
        }
        if (!props.agreedToLegalConsent) {
            dispatchFlashMessage('Zustimmen nicht vergessen!', 'error');
            return;
        }

        setIsUploading(true);
        const apiAdapter = new MusicsheetUploadApiAdapter(finalPayload);
        const payload = {
            ...finalPayload,
            instrumentSheets: apiAdapter.getCleanInstrumentSheets(),
        }
        if (inDebugMode) console.log('submit final payload: ', payload);
        axios.post('/musicsheet-upload', { ...payload }, { onUploadProgress: handleUploadProgress })
            .then(resp => {
                const response = new MusicsheetUploadResponse(resp);
                if (response.isSheetMusicPersisted()) {
                    setIsSuccess(true);
                    dispatchFlashMessage('Upload erfolgreich', 'success');
                    return;
                }
                if (response.hasValidationErrors()) {
                    const errorMsg = response.data?.messages[0] ?? '';
                    console.error('Upload failed with errrors: ', response.data.messages.map(msg => msg));
                    dispatchFlashMessage(`Upload fehlgeschlagen: ${errorMsg}`, 'error');
                    return;
                }
            })
            .catch(error => {
                setIsSuccess(false);
                setIsUploading(false);
                console.error('Submitting payload failed with error.', error);
                dispatchFlashMessage('Upload fehlgeschlagen', 'error');
            });
    }

    return (
        <section className="mt-20 py-24 flex justify-end">
            <div>
                <div>
                    <Button
                        onClick={submit}
                        variant="contained"
                        color="secondary"
                        id="submit-final"
                    >
                        <div className="flex items-center">
                            <PublishIcon className="text-white" />
                            <span className="ml-12 text-white text-xl font-bold">Musikstück Upload</span>
                        </div>
                    </Button>
                </div>
                {inDebugMode && <PersistFinalPayloadToFile finalPayload={finalPayload} />}
            </div>
            <UploadModal
                open={isUploading}
                success={isSuccess}
                totalSize={totalUploadSize}
                progress={uploadProgress}
                implementationMode={props.implementationMode}
                handleUploaderReset={resetUploader}
            />
        </section>
    );

    function resetUploader() {
        setIsSuccess(false);
        setIsUploading(false);
        props.handleReset();
    }

    function updateMetaData(metaData) {
        setFinalPayload(prev => ({
            ...prev,
            title: metaData?.title,
            subTitle: metaData?.subtitle,
            composerId: metaData?.composerId,
            customComposer: metaData?.composer,
            arrangeurId: metaData?.arrangerId,
            customArrangeur: metaData?.arranger,
            publisherId: metaData?.publisherId,
            customPublisher: metaData?.publisher,
            copyright: metaData?.copyright,
            iswc: metaData?.iswc,
            castId: metaData?.castId,
            tags: metaData?.tags,
        }));
    }

    function updateUploadScope(scopeObject) {
        setFinalPayload(prev => ({
            ...prev,
            ownerId: scopeObject?.ownerId,
            ownerType: scopeObject?.ownerType,
        }));
    }

    function updateInstrumentSheets(instrumentSheets) {
        setFinalPayload(prev => ({
            ...prev,
            instrumentSheets,
        }));
    }

    function updateSheetId(sheetId) {
        setFinalPayload(prev => ({
            ...prev,
            sheetId: sheetId ?? 0,
        }));
    }
};

export default SubmitFinalPayload;
