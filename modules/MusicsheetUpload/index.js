import React, { useState, useEffect } from 'react';
import MetaDataForm from './components/index/MetaDataForm';
import { UploaderContext } from './context/UploaderContext';
import UsagePermissionCheck from './components/index/UsagePermissionCheck';
import EditModeInspector from './components/musicsheetEdit/EditModeInspector';
import InstrumentSheetEditDialog from './InstrumentSheetEditDialog';
import useAvailableInstrumentVoices from './utils/useAvailableInstrumentVoices';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import i18next from 'i18next';
import { de, en } from './uploader-i18n';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import UploadVoiceSelector from '../MusicsheetUpload/components/index/UploadVoiceSelector';
import UploadOverview from '../MusicsheetUpload/components/index/UploadOverview';
import InfoPlaceholder from '../MusicsheetUpload/components/index/InfoPlaceholder';
import SafeButton from '@marschpat/Marschpat.UI.Components/modules/MusicsheetUpload/utils/SafeButton';

i18next.addResourceBundle('de', 'uploader', de);
i18next.addResourceBundle('en', 'uploader', en);

/**
 * MusicsheetUpload index
 *
 * @param {object} props required props:
 * { user, organisation, implementationMode, dispatchFlashMessage }
 */
const MusicsheetUpload = ({ user, organisation, implementationMode, dispatchFlashMessage }) => {
    const { t } = useTranslation(['uploader']);
    const [errors, setErrors] = useState(null); // used | validation errors from metaDataForm | scope MusicPiece
    const [sheetId, setSheetId] = useState(null); // unused | sheetId for editMode | scope instrumentSheet
    const [metaData, setMetaData] = useState(null); // used | metaData for MusicPiece | scope MusicPiece
    const [initialEdit, setInitialEdit] = useState(null); // used | initial values for editMode and MetaData | scope MusicPiece (Global)
    const [instrumentSheets, setInstrumentSheets] = useState([]); // used | instrumentSheets for MusicPiece | scope MusicPiece
    const [instrumentSheetInEdit, setInstrumentSheetInEdit] = useState(null); // used | instrumentSheet currently in editMode | scope instrumentSheet
    const [openEdit, setOpenEdit] = useState(false); // used | open/close editMode | scope Global
    const [resetChildState, setResetChildState] = useState(false); // used | resets data in MetaDataForm | scope Global (should be MusicPiece)
    const [inHelpMode, setInHelpMode] = useState(false); // used (unused) | toggles help mode | scope Global
    const [isMobile, setIsMobile] = useState(window.innerWidth < 720); // used | checks if app runs on mobile | scope Global
    const [selectedCast, setSelectedCast] = useState(null); // used | selected cast | scope MusicPiece
    const [openVoiceSelector, setOpenVoiceSelector] = useState(true); // used | toggles voice selector | scope Global

    // NEW AFTER REFACTORING
    const [musicPieces, setMusicPieces] = useState([]); // used | musicPieces for MusicPiece | scope MusicPieces
    const [selectedMusicPieceIndex, setSelectedMusicPieceIndex] = useState(null); // used | index of selected musicPiece | scope MusicPiece
    const [isMetadataVisible, setMetadataIsVisible] = useState(true); // used | toggles metadata form | scope Global

    const initialMetaData = require('./metaData.initial.json');
    useEffect(() => {
        if (musicPieces.length == 0) {
            musicPieces[0] = {
                metaData: initialMetaData,
                selectedCast: null,
                instrumentSheets: [],
                availableInstrumentVoices: [],
            };
            setSelectedMusicPieceIndex(0);
        }
    }, []);

    // Debugging Listener's ( TODO: remove )
    // NEW AFTER REFACTORING
    useEffect(() => {
        console.log('music Pieces after update: ', selectedMusicPieceIndex, musicPieces[0]);
    }, [musicPieces, selectedMusicPieceIndex]);

    useEffect(() => {
        console.log('user ', user);
        console.log('organisation ', organisation);
        console.log('implementationMode ', implementationMode);
    }, []);

    const handleMetaDataUpdate = (metaData, id) => {
        if (musicPieces[id]) {
            musicPieces[id].metaData = metaData;
        }
    };

    // OLD BEFORE REFACTORING
    useEffect(() => {
        console.log('Loading sheet id: ' + sheetId);
    }, [sheetId]);

    const [
        castOptions,
        availableInstrumentVoices,
        handleCastChange,
        handleAvailableVoicesUpdate,
        handleAvailableVoicesReset,
        setAvailableInstrumentVoices,
        setCastOptions,
    ] = useAvailableInstrumentVoices(instrumentSheets, implementationMode, organisation);

    const handleMetadataIsVisibleStateChangeClose = () => {
        setMetadataIsVisible(false);
    };

    const handleMetadataIsVisibleStateChangeOpen = () => {
        setMetadataIsVisible(true);
    };

    const handleCastChanged = cast => {
        handleCastChange(cast);
        setSelectedCast(cast);
    };

    const handleOnVoiceSelect = voice => {
        console.log('Voice selected: ', voice);
        setOpenVoiceSelector(false);
    };

    // handle backend save here
    const handeSaveClicked = () => {
        console.log('Save clicked');
    };

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
                    inHelpMode,
                    selectedMusicPieceIndex,
                }}
            >
                <UsagePermissionCheck>
                    <div className="max-w-3xl mx-auto my-20 px-16 sm:px-24">
                        <div className="flex justify-between items-center">
                            <Typography variant="h4" className="font-bold p-24">
                                {t('UPLOADER_TITLE')}
                            </Typography>
                            <SafeButton
                                text={t('UPLOADER_SAVE')}
                                isMobile={isMobile}
                                licenseCheckRequired={true}
                                onClick={handeSaveClicked}
                            ></SafeButton>
                        </div>
                        {isMobile ? (
                            <div>
                                <div
                                    className="grid grid-cols-1 gap-4"
                                    style={{
                                        flex: 1,
                                        visibility: !isMetadataVisible ? 'visible' : 'hidden',
                                        position: !isMetadataVisible ? 'relative' : 'absolute',
                                    }}
                                >
                                    {openVoiceSelector && (
                                        <UploadVoiceSelector
                                            filename={
                                                musicPieces[selectedMusicPieceIndex].metaData
                                                    ? musicPieces[selectedMusicPieceIndex].metaData
                                                          .title
                                                        ? musicPieces[selectedMusicPieceIndex]
                                                              .metaData.title
                                                        : t(
                                                              'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME'
                                                          )
                                                    : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')
                                            }
                                            instrumentation={
                                                selectedCast
                                                    ? selectedCast.label
                                                    : t(
                                                          'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION'
                                                      )
                                            }
                                            availableVoices={availableInstrumentVoices}
                                            isMetadataVisible={isMetadataVisible}
                                            isMobile={isMobile}
                                            onVoiceClick={handleOnVoiceSelect}
                                            handleCastCheck={castIsSetOrError}
                                            handleAssignedVoicesChange={handleAvailableVoicesUpdate}
                                            onMetadataEditClick={
                                                handleMetadataIsVisibleStateChangeOpen
                                            }
                                        />
                                    )}
                                    {!openVoiceSelector && (
                                        <UploadOverview
                                            filename={
                                                musicPieces[selectedMusicPieceIndex].metaData
                                                    ? musicPieces[selectedMusicPieceIndex].metaData
                                                          .title
                                                        ? musicPieces[selectedMusicPieceIndex]
                                                              .metaData.title
                                                        : t(
                                                              'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME'
                                                          )
                                                    : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')
                                            }
                                            instrumentation={
                                                selectedCast
                                                    ? selectedCast.label
                                                    : t(
                                                          'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION'
                                                      )
                                            }
                                            isMetadataVisible={isMetadataVisible}
                                            isMobile={isMobile}
                                            handleCastCheck={castIsSetOrError}
                                            handleAssignedVoicesChange={handleAvailableVoicesUpdate}
                                            onMetadataEditClick={
                                                handleMetadataIsVisibleStateChangeOpen
                                            }
                                            onInstrumentSheetsUpdate={addNewInstrumentSheets}
                                        />
                                    )}
                                </div>
                                <div
                                    className="flex box w-full h-full"
                                    style={{
                                        flex: 1,
                                        visibility: isMetadataVisible ? 'visible' : 'hidden',
                                        position: isMetadataVisible ? 'relative' : 'absolute',
                                    }}
                                >
                                    <MetaDataForm
                                        castOptions={castOptions}
                                        resetState={resetChildState}
                                        initialMetaData={
                                            musicPieces[selectedMusicPieceIndex].metaData
                                        }
                                        castWarningRequired={checkIfCastWarningMessageMayBeNeeded}
                                        handleUpdateErrors={setErrors}
                                        handleMetaDataUpdate={handleMetaDataUpdate}
                                        handleCastChange={handleCastChanged}
                                        handleVoicesAssignementReset={resetAllVoicesAssignements}
                                        isVisible={isMetadataVisible}
                                        onMetadataCloseClick={
                                            handleMetadataIsVisibleStateChangeClose
                                        }
                                        isMobile={isMobile}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {openVoiceSelector && (
                                    <UploadVoiceSelector
                                        filename={
                                            musicPieces[selectedMusicPieceIndex]?.metaData
                                                ? musicPieces[selectedMusicPieceIndex].metaData
                                                      .title
                                                    ? musicPieces[selectedMusicPieceIndex].metaData
                                                          .title
                                                    : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')
                                                : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')
                                        }
                                        instrumentation={
                                            selectedCast
                                                ? selectedCast.label
                                                : t(
                                                      'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION'
                                                  )
                                        }
                                        availableVoices={availableInstrumentVoices}
                                        isMetadataVisible={isMetadataVisible}
                                        isMobile={isMobile}
                                        onVoiceClick={handleOnVoiceSelect}
                                        handleCastCheck={castIsSetOrError}
                                        handleAssignedVoicesChange={handleAvailableVoicesUpdate}
                                        onMetadataEditClick={handleMetadataIsVisibleStateChangeOpen}
                                    />
                                )}
                                {!openVoiceSelector && (
                                    <UploadOverview
                                        filename={
                                            musicPieces[selectedMusicPieceIndex]?.metaData
                                                ? musicPieces[selectedMusicPieceIndex].metaData
                                                      .title
                                                    ? musicPieces[selectedMusicPieceIndex].metaData
                                                          .title
                                                    : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')
                                                : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')
                                        }
                                        instrumentation={
                                            selectedCast
                                                ? selectedCast.label
                                                : t(
                                                      'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION'
                                                  )
                                        }
                                        isMetadataVisible={isMetadataVisible}
                                        isMobile={isMobile}
                                        handleCastCheck={castIsSetOrError}
                                        handleAssignedVoicesChange={handleAvailableVoicesUpdate}
                                        onMetadataEditClick={handleMetadataIsVisibleStateChangeOpen}
                                        onInstrumentSheetsUpdate={addNewInstrumentSheets}
                                    />
                                )}
                                <div
                                    style={{
                                        flex: 1,
                                        visibility: isMetadataVisible ? 'visible' : 'hidden',
                                        position: isMetadataVisible ? 'relative' : 'absolute',
                                    }}
                                    className="flex flex-wrap"
                                >
                                    <MetaDataForm
                                        castOptions={castOptions}
                                        resetState={resetChildState}
                                        initialMetaData={
                                            musicPieces[selectedMusicPieceIndex]?.metaData
                                        }
                                        castWarningRequired={checkIfCastWarningMessageMayBeNeeded}
                                        handleUpdateErrors={setErrors}
                                        handleMetaDataUpdate={handleMetaDataUpdate}
                                        handleCastChange={handleCastChanged}
                                        handleVoicesAssignementReset={resetAllVoicesAssignements}
                                        isVisible={isMetadataVisible}
                                        onMetadataCloseClick={
                                            handleMetadataIsVisibleStateChangeClose
                                        }
                                    />
                                </div>
                                <div
                                    style={{
                                        flex: 1,
                                        visibility: !isMetadataVisible ? 'visible' : 'hidden',
                                        position: !isMetadataVisible ? 'relative' : 'absolute',
                                    }}
                                >
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
                        )}
                    </div>
                </UsagePermissionCheck>
                {instrumentSheetInEdit && openEdit && (
                    <InstrumentSheetEditDialog
                        open={openEdit}
                        castName={musicPieces[selectedMusicPieceIndex]?.metaData?.castName}
                        instrumentSheet={instrumentSheetInEdit}
                        handleClose={toggleInstrumentSheetEditDialog}
                        handleInstrumentSheetUpdate={updateInstrumentSheet}
                        handleNextInstrumentSheet={openNextAvailableInstrumentSheet}
                        handleOriginalFileManipulation={manipulateInstrumentSheets}
                    />
                )}
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
    function addNewInstrumentSheets(sheets, id) {
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
