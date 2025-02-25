import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UploadModal from './UploadModal';
import { MP_EDU } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import PersistFinalPayloadToFile from './PersistPayloadToFile';
import { UploaderContext } from '../../context/UploaderContext';
import useUploadProgress from '../../utils/useUploadProgress';
import { getCompletionStatus } from '../../utils/InstrumentSheetsHelper';
import MusicsheetUploadResponse from '../../utils/MusicsheetUploadResponse';
import MusicsheetUploadApiAdapter from '../../utils/MusicsheetUploadApiAdapter';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import { useTranslation } from 'react-i18next';

const initialPayload = require('../../musicsheet.initial.json');

const SubmitFinalPayload = props => {
    const { t } = useTranslation(['uploader']);
    const [finalPayload, setFinalPayload] = useState(initialPayload);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { dispatchFlashMessage, implementationMode } = useContext(UploaderContext);
    const inDebugMode = useInDebugMode();
    const [uploadProgress, totalUploadSize, handleUploadProgress] = useUploadProgress();

    useEffect(() => updateMetaData(props.metaData), [props.metaData]);
    useEffect(() => updateUploadScope(props.uploadScope), [props.uploadScope]);
    useEffect(() => updateInstrumentSheets(props.instrumentSheets), [props.instrumentSheets]);
    useEffect(() => updateSheetId(props.sheetId), [props.sheetId]);

    // @ToDo: Sry for the mess, needs refactoring when all requirements are clear
    const submit = () => {
        if (props.errors && props.errors.length > 0) {
            dispatchFlashMessage(t('UPLOADER_REQ_DATA_MISSING'), 'error');
            return;
        }
        if (!finalPayload.instrumentSheets || finalPayload.instrumentSheets.length < 1) {
            dispatchFlashMessage(t('UPLOADER_REQ_VOICES_MISSING'), 'error');
            return;
        }
        const allSheetsCompleted = finalPayload.instrumentSheets.every(sheet => {
            const [completed] = getCompletionStatus(sheet);
            return completed;
        });
        if (!allSheetsCompleted) {
            dispatchFlashMessage(t('UPLOADER_REQ_VOICES_ASSIGN_MISSING'), 'error');
            return;
        }
        if (!props.agreedToLegalConsent) {
            dispatchFlashMessage(t('UPLOADER_VOICES_FORGET'), 'error');
            return;
        }

        setIsUploading(true);
        const reqData = prepareImplementationSpecificPayload(finalPayload);
        const apiAdapter = new MusicsheetUploadApiAdapter(reqData, implementationMode);
        const payload = {
            ...reqData,
            instrumentSheets: apiAdapter.getCleanInstrumentSheets(),
        };
        if (inDebugMode) console.log('submit final payload: ', payload);
        axios
            .post('v1/musicsheet-upload', { ...payload }, { onUploadProgress: handleUploadProgress })
            .then(resp => {
                const response = new MusicsheetUploadResponse(resp);
                if (response.isSheetMusicPersisted()) {
                    setIsSuccess(true);
                    dispatchFlashMessage(t('UPLOADER_UPLOAD_SUCCESS'), 'success');
                    return;
                }
                if (response.hasValidationErrors()) {
                    const errorMsg = response.data?.messages[0] ?? '';
                    console.error(
                        'Upload failed with errrors: ',
                        response.data.messages.map(msg => msg)
                    );
                    dispatchFlashMessage(`${t('UPLOADER_UPLOAD_ERROR')}: ${errorMsg}`, 'error');
                    setHasError(errorMsg);
                    return;
                }
            })
            .catch(error => {
                setIsSuccess(false);
                setIsUploading(false);
                console.error('Submitting payload failed with error.', error);
                dispatchFlashMessage(t('UPLOADER_UPLOAD_ERROR'), 'error');
            });
    };

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
                            <span className="ml-12 text-white text-xl font-bold">
                                {t('UPLOADER_UPLOAD_SHEET_ACTION')}
                            </span>
                        </div>
                    </Button>
                </div>
                {inDebugMode && <PersistFinalPayloadToFile finalPayload={finalPayload} />}
            </div>
            <UploadModal
                open={isUploading}
                success={isSuccess}
                hasError={hasError}
                totalSize={totalUploadSize}
                progress={uploadProgress}
                handleSubmitPayloadReset={resetSubmitPayload}
            />
        </section>
    );

    function resetSubmitPayload() {
        setIsUploading(false);
        setIsSuccess(false);
        setHasError(false);
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

    function prepareImplementationSpecificPayload(payload) {
        if (implementationMode === MP_EDU) {
            delete payload.castId;
            return payload;
        }

        return payload;
    }
};

export default SubmitFinalPayload;
