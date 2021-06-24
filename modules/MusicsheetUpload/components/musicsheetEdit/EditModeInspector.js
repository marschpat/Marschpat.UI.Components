import React, { useState, useEffect } from 'react';
import DownloadEditData from './DownloadEditData';
import InitializeFromLocalPayload from './InitializeFromLocalPayload';
import MusicsheetDownloadApiAdapter from '../../utils/MusicsheetDownloadApiAdapter';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import useDispatchFlashMessage from '@marschpat/Marschpat.UI.Components/utils/useDispatchFlashMessage';
import history from '@history';

const EditModeInspector = props => {
    const [sheetInEdit, setSheetInEdit] = useState(null);
    const dispatchFlashMessage = useDispatchFlashMessage();
    const inDebugMode = useInDebugMode();

    const initializeEditMode = rawData => {
        const apiAdapter = new MusicsheetDownloadApiAdapter(rawData);
        const metaData = apiAdapter.getMetaData();
        const uploadScope = apiAdapter.getUploadScope();
        const instrumentSheets = apiAdapter.getInstrumentSheets();
        props.handleInitialEditValues({
            metaData,
            uploadScope,
        });
        props.handleInstrumentSheets(instrumentSheets);
        props.handleSheetId(sheetInEdit);
        close();
    }

    const abortEditMode = () => {
        const msg = 'Aktuell können nur neue Musikstücke bearbeitet werden. Bitte warten, oder legen sie das Musikstück erneut an.'
        dispatchFlashMessage(msg, 'warning');
        close();
    }

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
            {inDebugMode && <InitializeFromLocalPayload handleMusicsheetEditData={initializeEditMode} />}
        </>
    );

    function close() {
        const url = new URL(window.location);
        setSheetInEdit(null);
        history.replace({ pathname: url.pathname });
    }
}

export default EditModeInspector;
