import React, { useState, useEffect, useContext } from 'react';
import DownloadEditData from './DownloadEditData';
import InitializeFromLocalPayload from './InitializeFromLocalPayload';
import { UploaderContext } from '../../context/UploaderContext';
import MusicsheetDownloadApiAdapter from '../../utils/MusicsheetDownloadApiAdapter';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import history from '@history';
import { useTranslation } from 'react-i18next';

const EditModeInspector = props => {
    const { t } = useTranslation(['uploader']);
    const [sheetInEdit, setSheetInEdit] = useState(null);
    const { dispatchFlashMessage, implementationMode } = useContext(UploaderContext);
    const inDebugMode = useInDebugMode();

    const initializeEditMode = rawData => {
        if (inDebugMode) {
            console.log('InitializeEditMode, rawData:', rawData);
        }
        const apiAdapter = new MusicsheetDownloadApiAdapter(rawData, implementationMode);
        const metaData = apiAdapter.getMetaData();
        const uploadScope = apiAdapter.getUploadScope();
        const instrumentSheets = apiAdapter.getInstrumentSheets(
            t('UPLOADER_VOICE_EDIT_STATUS_NOTICE')
        );
        props.handleInitialEditValues({
            metaData,
            uploadScope,
        });
        props.handleInstrumentSheets(instrumentSheets);
        props.handleSheetId(sheetInEdit);
        close();
    };

    const abortEditMode = () => {
        const msg = t('UPLOADER_ABORT_EDIT_MODE');
        dispatchFlashMessage(msg, 'warning');
        close();
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sheetId = urlParams.get('sheetid');
        if (sheetId) {
            setSheetInEdit(parseInt(sheetId));
        }
    }, []);

    return (
        <>
            {props.children}
            {sheetInEdit && (
                <DownloadEditData
                    sheetId={sheetInEdit}
                    abort={abortEditMode}
                    handleMusicsheetEditData={initializeEditMode}
                />
            )}
            {inDebugMode && (
                <InitializeFromLocalPayload handleMusicsheetEditData={initializeEditMode} />
            )}
        </>
    );

    function close() {
        const url = new URL(window.location);
        setSheetInEdit(null);
        history.replace({ pathname: url.pathname });
    }
};

export default EditModeInspector;
