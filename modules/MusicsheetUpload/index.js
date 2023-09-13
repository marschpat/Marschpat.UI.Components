import React, { useState, useEffect } from 'react';
import ReviewPages from './components/index/ReviewPages';
import FileDropzone from './components/index/FileDropzone';
import MetaDataForm from './components/index/MetaDataForm';
import LegalConsent from './components/index/LegalConsent';
import { UploaderContext } from './context/UploaderContext';
import UsagePermissionCheck from './components/index/UsagePermissionCheck';
import SubmitFinalPayload from './components/index/SubmitFinalPayload';
import UploadScopeSelector from './components/index/UploadScopeSelector';
import InstrumentSheetsOverview from './components/index/InstrumentSheetsOverview';
import EditModeInspector from './components/musicsheetEdit/EditModeInspector';
import InstrumentSheetEditDialog from './InstrumentSheetEditDialog';
import useAvailableInstrumentVoices from './utils/useAvailableInstrumentVoices';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import i18next from 'i18next';
import { de, en } from './uploader-i18n';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import UploadVoiceSelector from '../MusicsheetUpload/components/index/UploadVoiceSelector';
import InfoPlaceholder from '../MusicsheetUpload/components/index/InfoPlaceholder';

i18next.addResourceBundle('de', 'uploader', de);
i18next.addResourceBundle('en', 'uploader', en);

/**
 * MusicsheetUpload index
 *
 * @param {object} props required props:
 * { user, organisation, implementationMode, dispatchFlashMessage }
 */
const MusicsheetUpload = ({ user, organisation, implementationMode, dispatchFlashMessage }) => {
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
    const [inHelpMode, setInHelpMode] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 720);
    const [selectedCast, setSelectedCast] = useState(null);

    // visibillity states for mobile view popups
    const [isVisible, setIsVisible] = useState(false);
    const [isMetadataVisible, setMetadataIsVisible] = useState(true);

    const [
        castOptions,
        availableInstrumentVoices,
        handleCastChange,
        handleAvailableVoicesUpdate,
        handleAvailableVoicesReset,
    ] = useAvailableInstrumentVoices(instrumentSheets, implementationMode, organisation);

    const { t } = useTranslation(['uploader']);

    const handleMetadataIsVisibleStateChangeClose = () => {
        setMetadataIsVisible(false);
    };

    const handleMetadataIsVisibleStateChangeOpen = () => {
        setMetadataIsVisible(true);
    };

    const handeCastChanged = (cast) => {
        handleCastChange(cast);
        setSelectedCast(cast);
    }

    // In case resetChildState was triggerd, reset it back to false after resetting the child components
    useEffect(() => {
        setResetChildState(false);
    }, [resetChildState]);

    useEffect(() => {
        // function to handle resize event
        const handleResize = () => {
            setIsMobile(window.innerWidth < 720);
        };

        // Add event listener on component mount for resize event
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div id="uploader-top">
            <UploaderContext.Provider
                value={{
                    user,
                    organisation,
                    implementationMode,
                    dispatchFlashMessage,
                    availableInstrumentVoices,
                    handleAvailableVoicesUpdate,
                    inHelpMode,
                    setInHelpMode,
                }}
            >
                <EditModeInspector
                    handleSheetId={setSheetId}
                    handleInitialEditValues={setInitialEdit}
                    handleInstrumentSheets={setInstrumentSheets}
                >
                    <UsagePermissionCheck>
                        <div className="max-w-3xl mx-auto my-20 px-16 sm:px-24">
                            <Typography variant="h4" className="font-bold p-24">
                                {t('UPLOADER_TITLE')}
                            </Typography>
                            {isMobile ? 
                                <div>
                                    <div className="grid grid-cols-1 gap-4" style={{ flex: 1, visibility: !isMetadataVisible ? "visible" : "hidden", position: !isMetadataVisible ? 'relative' : 'absolute'}}>
                                        <UploadVoiceSelector
                                            filename={metaData ? metaData.title ? metaData.title : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME') : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')}
                                            instrumentation={selectedCast ? selectedCast.label : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION')}
                                            availableVoices={availableInstrumentVoices}
                                            isMetadataVisible={isMetadataVisible}
                                            isMobile={isMobile}
                                            handleCastCheck={castIsSetOrError}
                                            handleAssignedVoicesChange={handleAvailableVoicesUpdate}
                                            onMetadataEditClick={handleMetadataIsVisibleStateChangeOpen}
                                        />
                                    </div>
                                    <div className="flex box w-full h-full" style={{ flex: 1, visibility: isMetadataVisible ? "visible" : "hidden", position: isMetadataVisible ? 'relative' : 'absolute'}}>
                                        <MetaDataForm
                                            castOptions={castOptions}
                                            resetState={resetChildState}
                                            initialMetaData={initialEdit?.metaData}
                                            castWarningRequired={checkIfCastWarningMessageMayBeNeeded}
                                            handleUpdateErrors={setErrors}
                                            handleMetaDataUpdate={setMetaData}
                                            handleCastChange={handeCastChanged}
                                            handleVoicesAssignementReset={resetAllVoicesAssignements}
                                            isVisible={isMetadataVisible}
                                            onMetadataCloseClick={handleMetadataIsVisibleStateChangeClose}
                                            isMobile={isMobile}
                                        />
                                    </div>
                                </div>
                            : 
                                <div className="grid grid-cols-2 gap-4">
                                    <UploadVoiceSelector
                                        filename={metaData ? metaData.title ? metaData.title : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME') : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')}
                                        instrumentation={selectedCast ? selectedCast.label : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION')}
                                        availableVoices={availableInstrumentVoices}
                                        isMetadataVisible={isMetadataVisible}
                                        isMobile={isMobile}
                                        handleCastCheck={castIsSetOrError}
                                        handleAssignedVoicesChange={handleAvailableVoicesUpdate}
                                        onMetadataEditClick={handleMetadataIsVisibleStateChangeOpen}
                                    />
                                    <div style={{ flex: 1, visibility: isMetadataVisible ? "visible" : "hidden", position: isMetadataVisible ? 'relative' : 'absolute'}} className="flex flex-wrap"> 
                                        <MetaDataForm
                                            castOptions={castOptions}
                                            resetState={resetChildState}
                                            initialMetaData={initialEdit?.metaData}
                                            castWarningRequired={checkIfCastWarningMessageMayBeNeeded}
                                            handleUpdateErrors={setErrors}
                                            handleMetaDataUpdate={setMetaData}
                                            handleCastChange={handeCastChanged}
                                            handleVoicesAssignementReset={resetAllVoicesAssignements}
                                            isVisible={isMetadataVisible}
                                            onMetadataCloseClick={handleMetadataIsVisibleStateChangeClose}
                                        />
                                    </div>
                                    <div style={{ flex: 1, visibility: !isMetadataVisible ? "visible" : "hidden", position: !isMetadataVisible ? 'relative' : 'absolute'}}>
                                        <InfoPlaceholder numberOfNoteSheets={instrumentSheets.length} />
                                    </div>
                                    {/**<UploadScopeSelector
                                        initialScope={initialEdit?.uploadScope}
                                        userSubscriptionValidationRequired={false}
                                        handleUploadScopeUpdate={setUploadScope}
                                    />
                                    <FileDropzone
                                        resetState={resetChildState}
                                        handleInstrumentSheetsUpdate={addNewInstrumentSheets}
                                    />
                                    <LegalConsent
                                        agreed={agreedToLegalConsent}
                                        handleChange={() =>
                                            setAgreedToLegalConsent(!agreedToLegalConsent)
                                        }
                                    />
                                    <SubmitFinalPayload
                                        errors={errors}
                                        sheetId={sheetId}
                                        metaData={metaData}
                                        uploadScope={uploadScope}
                                        instrumentSheets={instrumentSheets}
                                        agreedToLegalConsent={agreedToLegalConsent}
                                    />
                                    {inDebugMode && <ReviewPages instrumentSheets={instrumentSheets} />}*/}
                                </div>
                            }
                        </div>
                    </UsagePermissionCheck>
                    {instrumentSheetInEdit && openEdit && (
                        <InstrumentSheetEditDialog
                            open={openEdit}
                            castName={metaData?.castName}
                            instrumentSheet={instrumentSheetInEdit}
                            handleClose={toggleInstrumentSheetEditDialog}
                            handleInstrumentSheetUpdate={updateInstrumentSheet}
                            handleNextInstrumentSheet={openNextAvailableInstrumentSheet}
                            handleOriginalFileManipulation={manipulateInstrumentSheets}
                        />
                    )}
                </EditModeInspector>
            </UploaderContext.Provider>
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
            const existingFileNames = prevSheets.flatMap(sheet =>
                sheet.origFiles.map(orig => orig.name)
            );
            const newSheets = sheets.filter(sheet =>
                sheet.origFiles.some(file => {
                    if (existingFileNames.indexOf(file.name) !== -1) {
                        dispatchFlashMessage(
                            `${t('UPLOADER_INDEX_FILE')} "${file.name}" ${t(
                                'UPLOADER_INDEX_ALREADY_ADDED'
                            )}`,
                            'warning'
                        );
                        return false;
                    }

                    return true;
                })
            );

            return [...prevSheets, ...newSheets];
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
                .map(sheet =>
                    sheet.uuid === manipulation.replacement.uuid ? manipulation.replacement : sheet
                );
        });
        setInstrumentSheetInEdit(manipulation.replacement);
        setOpenEdit(true);
        dispatchFlashMessage(t('UPLOADER_INDEX_NEWVOICESEXTRACTED'), 'success');
    }

    function checkIfCastWarningMessageMayBeNeeded() {
        if (
            instrumentSheets.length > 0 &&
            instrumentSheets.some(sheet => sheet.voices.length > 0)
        ) {
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
        const existingIndex = instrumentSheets.findIndex(
            sheet => sheet.uuid === instrumentSheetInEdit.uuid
        );
        const candidate = direction === 'next' ? existingIndex + 1 : existingIndex - 1;
        const fallbackIndex = direction === 'next' ? 0 : instrumentSheets.length - 1;
        const newIndex = instrumentSheets[candidate] ? candidate : fallbackIndex;
        setInstrumentSheetInEdit(instrumentSheets[newIndex]);
    }
};

export default MusicsheetUpload;
