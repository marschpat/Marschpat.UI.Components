import React, { useState, useEffect } from 'react';
import ReviewPages from './components/index/ReviewPages';
import FileDropzone from './components/index/FileDropzone';
import MetaDataForm from './components/index/MetaDataForm';
import LegalConsent from './components/index/LegalConsent';
import UsagePermissionCheck from './components/index/UsagePermissionCheck';
import SubmitFinalPayload from './components/index/SubmitFinalPayload';
import UploadScopeSelector from "./components/index/UploadScopeSelector";
import InstrumentSheetsOverview from './components/index/InstrumentSheetsOverview';
import EditModeInspector from './components/musicsheetEdit/EditModeInspector';
import InstrumentSheetEditDialog from './InstrumentSheetEditDialog';
import useAvailableInstrumentVoices from './utils/useAvailableInstrumentVoices';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import FusePageSimple from '@fuse/core/FusePageSimple';

/**
 * MusicsheetUpload index
 *
 * @param {object} props required props:
 * { user, organisation, implementationMode, dispatchFlashMessage }
 */
const MusicsheetUpload = props => {
    const inDebugMode = useInDebugMode();
    const [errors, setErrors] = useState(null);
    const [sheetId, setSheetId] = useState(null);
    const [metaData, setMetaData] = useState(null);
    const [initialEdit, setInitialEdit] = useState(null);
    const [uploadScope, setUploadScope] = useState(null);
    const [instrumentSheets, setInstrumentSheets] = useState([]);
    const [instrumentSheetInEdit, setInstrumentSheetInEdit] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [resetChildState, setResetChildState] = useState(false);
    const [agreedToLegalConsent, setAgreedToLegalConsent] = useState(false);
    const dispatchFlashMessage = props.dispatchFlashMessage;
    const [
        castOptions,
        availableInstrumentVoices,
        handleCastChange,
        handleAvailableVoicesUpdate,
        handleAvailableVoicesReset,
    ] = useAvailableInstrumentVoices(instrumentSheets);

    // In case resetChildState was triggerd, reset it back to false after resetting the child components
    useEffect(() => {
        setResetChildState(false);
    }, [resetChildState]);

    return (
        <div id="uploader-top">
            <EditModeInspector
                dispatchFlashMessage={props.dispatchFlashMessage}
                handleSheetId={setSheetId}
                handleInitialEditValues={setInitialEdit}
                handleInstrumentSheets={setInstrumentSheets}
            >
                <FusePageSimple
                    content={
                        <UsagePermissionCheck implementationMode={props.implementationMode}>
                            <div className="my-20 px-16 sm:px-24">
                                <MetaDataForm
                                    castOptions={castOptions}
                                    resetState={resetChildState}
                                    initialMetaData={initialEdit?.metaData}
                                    castWarningRequired={checkIfCastWarningMessageMayBeNeeded}
                                    implementationMode={props.implementationMode}
                                    handleUpdateErrors={setErrors}
                                    handleMetaDataUpdate={setMetaData}
                                    handleCastChange={handleCastChange}
                                    handleVoicesAssignementReset={resetAllVoicesAssignements}
                                />
                                <UploadScopeSelector
                                    user={props.user}
                                    organisation={props.organisation}
                                    implementationMode={props.implementationMode}
                                    initialScope={initialEdit?.uploadScope}
                                    userSubscriptionValidationRequired={false}
                                    handleUploadScopeUpdate={setUploadScope}
                                />
                                <InstrumentSheetsOverview
                                    instrumentSheets={instrumentSheets}
                                    availableVoices={availableInstrumentVoices}
                                    dispatchFlashMessage={props.dispatchFlashMessage}
                                    handleCastCheck={castIsSetOrError}
                                    handleInstrumentSheetsUpdate={setInstrumentSheets}
                                    handleRemoveInstrumentSheets={removeInstrumentSheets}
                                    handleAssignedVoicesChange={handleAvailableVoicesUpdate}
                                    handleOpenInstrumentSheetEdit={toggleInstrumentSheetEditDialog}
                                />
                                <FileDropzone
                                    resetState={resetChildState}
                                    handleInstrumentSheetsUpdate={addNewInstrumentSheets}
                                />
                                <LegalConsent
                                    agreed={agreedToLegalConsent}
                                    handleChange={() => setAgreedToLegalConsent(!agreedToLegalConsent)}
                                />
                                <SubmitFinalPayload
                                    errors={errors}
                                    sheetId={sheetId}
                                    metaData={metaData}
                                    uploadScope={uploadScope}
                                    instrumentSheets={instrumentSheets}
                                    agreedToLegalConsent={agreedToLegalConsent}
                                    implementationMode={props.implementationMode}
                                    dispatchFlashMessage={props.dispatchFlashMessage}
                                    handleReset={resetUploaderState}
                                />
                                {inDebugMode && <ReviewPages instrumentSheets={instrumentSheets} />}
                            </div>
                        </UsagePermissionCheck>
                    }
                />
                {instrumentSheetInEdit && openEdit && (
                    <InstrumentSheetEditDialog
                        open={openEdit}
                        castName={metaData?.castName}
                        instrumentSheet={instrumentSheetInEdit}
                        availableVoices={availableInstrumentVoices}
                        dispatchFlashMessage={props.dispatchFlashMessage}
                        handleClose={toggleInstrumentSheetEditDialog}
                        handleInstrumentSheetUpdate={updateInstrumentSheet}
                        handleAssignedVoicesChange={handleAvailableVoicesUpdate}
                        handleNextInstrumentSheet={openNextAvailableInstrumentSheet}
                        handleOriginalFileManipulation={manipulateInstrumentSheets}
                    />
                )}
            </EditModeInspector>
        </div>
    );

    /**
     * Open and close the InstrumentSheetEditDialog
     * Only allow opening the editor if the "cast" is set
     */
    function toggleInstrumentSheetEditDialog(instrumentSheet = false) {
        if (!castIsSetOrError()) return false;
        setOpenEdit(instrumentSheet ? true : false);
        setInstrumentSheetInEdit(instrumentSheet ?? null);
    }

    /**
     * Remove the "deleted" file from originalFiles array
     */
     function removeInstrumentSheets(uuids) {
        setInstrumentSheets(prev => {
            return prev.filter(sheet => !uuids.includes(sheet.uuid));
        });
    }

    /**
     * Add new instrumentSheets. Check if an originalFile name from the new instrumentSheets
     * already exists in originalFiles of existing instrumentSheets. If so don't add it to originalFiles.
     */
    function addNewInstrumentSheets(sheets) {
        if (sheets.length < 1) return;
        setInstrumentSheets(prevSheets => {
            const existingFileNames = prevSheets.flatMap(sheet => sheet.origFiles.map(orig => orig.name));
            const newSheets = sheets.filter(sheet => !sheet.origFiles.some(file => existingFileNames.indexOf(file.name) !== -1));

            return [ ...prevSheets, ...newSheets];
        });
    }

    /**
     * Update one instrumentSheet after edit. Replace instrumentSheet in state if it already exists.
     * If the instrumentSheet was dirty (because of previous merge) set dirty back to false.
     */
    function updateInstrumentSheet(instrumentSheet) {
        let newSheets = instrumentSheets;
        if ('dirty' in instrumentSheet) {
            instrumentSheet.dirty = false;
        }
        const existingIndex = newSheets.findIndex(sheet => sheet.uuid === instrumentSheet.uuid);
        if (existingIndex >= 0) {
            newSheets[existingIndex] = instrumentSheet;
        } else {
            newSheets.push(instrumentSheet);
        }

        setInstrumentSheets(newSheets);
    }

    /**
     * Add new instrumentSheets and replace instrumentSheet if replacement exists
     */
    function manipulateInstrumentSheets(manipulation) {
        setOpenEdit(false);
        setInstrumentSheets(prev => {
            return prev
                .concat(manipulation.add)
                .map(sheet => sheet.uuid === manipulation.replacement.uuid ? manipulation.replacement : sheet);
        });
        setInstrumentSheetInEdit(manipulation.replacement);
        setOpenEdit(true);
        dispatchFlashMessage('Neue Instrumentenstimme extrahiert', 'success');
    }

    /**
     * Reset MusicsheetUploader back to initial state.
     * Also set ResetChildState to true.
     * @ToDo: refactor, find a better way to do this
     */
    function resetUploaderState() {
        setMetaData(null);
        setInstrumentSheets([]);
        setOpenEdit(false);
        setInstrumentSheetInEdit(null);
        handleAvailableVoicesReset();
        setErrors(null);
        setAgreedToLegalConsent(false);
        setResetChildState(true);
        document.getElementById('uploader-top').scrollIntoView(true);
    }

    function checkIfCastWarningMessageMayBeNeeded() {
        if (instrumentSheets.length > 0 && instrumentSheets.some(sheet => sheet.voices.length > 0)) {
            return true;
        }

        return false;
    }

    function castIsSetOrError() {
        const castError = errors.find(error => error.attrName === 'cast') ?? false;
        if (castError) {
            dispatchFlashMessage(castError.msg, 'error');
            return false;
        }

        return true;
    }

    /**
     * Reset all voice assignements (`voices`) back to an empty array
     */
    function resetAllVoicesAssignements() {
        if (instrumentSheets.length < 1) return;
        setInstrumentSheets(prevSheets => prevSheets.map(sheet => ({ ...sheet, voices: [] })));
    }

    /**
     * Open the next available instrumentSheet, depending on the direction (next or previous)
     */
    function openNextAvailableInstrumentSheet(direction) {
        const existingIndex = instrumentSheets.findIndex(sheet => sheet.uuid === instrumentSheetInEdit.uuid);
        const candidate = direction === 'next' ? existingIndex + 1 : existingIndex - 1;
        const fallbackIndex = direction === 'next' ? 0 : instrumentSheets.length - 1;
        const newIndex = instrumentSheets[candidate] ? candidate : fallbackIndex;
        setInstrumentSheetInEdit(instrumentSheets[newIndex]);
    }
}

export default MusicsheetUpload;
