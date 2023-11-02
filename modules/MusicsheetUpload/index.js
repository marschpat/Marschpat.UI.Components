import React, { useState, useEffect } from 'react';
import MetaDataForm from './components_2.0/MetaDataForm_2.0';
import { UploaderContext } from './context/UploaderContext';
import UsagePermissionCheck from './components/index/UsagePermissionCheck';
import i18next from 'i18next';
import { de, en } from './uploader-i18n';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import UploadVoiceSelector from './components_2.0/UploadVoiceSelector';
import UploadOverview from './components_2.0/UploadOverview';
import InfoPlaceholder from './components_2.0/InfoPlaceholder';
import SafeButton from '@marschpat/Marschpat.UI.Components/modules/MusicsheetUpload/utils_2.0/SafeButton';
import useAvailableInstrumentHelper from './utils_2.0/useAvailableInstrumentHelper';
import { set } from 'lodash';
import FileEditor from './components_2.0/FileEditor';

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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 720); // used | checks if app runs on mobile | scope Global
    const [visibillityStates, setVisibillityStates] = useState({}); // used | safes the collapsed states of UploadOverview | scope Global

    const [castOptions, getInstrumentVoicesOfCast, mapCastToInstrumentVoices, getAvailableVoices] =
        useAvailableInstrumentHelper(implementationMode, organisation);

    // NEW AFTER REFACTORING
    const [musicPieces, setMusicPieces] = useState([]); // used | musicPieces for MusicPiece | scope MusicPieces
    const [selectedMusicPieceIndex, setSelectedMusicPieceIndex] = useState(0); // used | index of selected musicPiece | scope MusicPiece
    const [isMetadataVisible, setMetadataIsVisible] = useState(true); // used | toggles metadata form | scope Global
    const [isVoiceSelectorVisible, setIsVoiceSelectorVisible] = useState(true); // used | toggles voice selector | scope Global
    const [tempInstrumentSheetIndexForVoiceAdd, setTempInstrumentSheetIndexForVoiceAdd] =
        useState(null); // used | temp index for voice add | scope Global

    // NEW FOR EDITOR HANDLING
    const [isFileEditorVisible, setIsFileEditorVisible] = useState(false); // used | toggles file editor | scope Global
    const [tempFileInEdit, setTempFileInEdit] = useState(null); // used | temp file in edit | scope Global
    const [tempSelectedVoicesInEdit, setTempSelectedVoicesInEdit] = useState(null); // used | temp selected voices in edit | scope Global
    const [tempMetaDataInEdit, setTempMetaDataInEdit] = useState(null); // used | temp metadata in edit | scope Global
    const [tempIndexForFileEdit, setIndexForFileEdit] = useState({
        index: null,
        instrumentSheetIndex: null,
        origFilesIndex: null,
    });

    const initialMetaData = require('./metaData.initial.json');

    useEffect(() => {
        if (musicPieces.length == 0) {
            musicPieces[0] = {
                metaData: initialMetaData,
                selectedCast: null,
                instrumentSheets: [
                    {
                        voices: [],
                    },
                ],
                availableInstrumentVoices: [],
            };
            setSelectedMusicPieceIndex(0);
        }

        setVisibillityStates({
            isExpanded: [],
            isExpandedInstrumentSheets: [[]],
        });

        // Add event listener on component mount for resize event
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // function to handle resize event
    const handleResize = () => {
        setIsMobile(window.innerWidth < 720);
    };

    // handle backend save here
    const handeSaveClicked = () => {
        /// TODO : save musicPieces to backend
        /// all data is in musicPieces
        console.log('Save clicked: ...insert backend call here...');
    };

    // handle open file editor
    const handleOpenFileEditor = (index, instrumentSheetIndex, origFilesIndex) => {
        setIndexForFileEdit({
            index: index,
            instrumentSheetIndex: instrumentSheetIndex,
            origFilesIndex: origFilesIndex,
        });

        setTempFileInEdit({
            ...musicPieces?.[index]?.instrumentSheets?.[instrumentSheetIndex]?.origFiles?.[
                origFilesIndex
            ],
        });

        setTempSelectedVoicesInEdit([
            ...musicPieces?.[index]?.instrumentSheets?.[instrumentSheetIndex]?.voices,
        ]);

        setTempMetaDataInEdit({
            ...musicPieces?.[index]?.metaData,
        });

        /// TODO : disable SideBar
        setIsFileEditorVisible(true);
    };

    // handle file editor close
    const handelFileEditorClose = () => {
        setTempFileInEdit(null);
        setTempSelectedVoicesInEdit(null);
        setTempMetaDataInEdit(null);
        setIndexForFileEdit({ index: null, instrumentSheetIndex: null, origFilesIndex: null });
        /// TODO : enable SideBar
        setIsFileEditorVisible(false);
    };

    const handelFileEditorSave = (serializedCanvas, pngs) => {
        if (serializedCanvas && tempIndexForFileEdit?.index) {
            if (
                musicPieces?.[tempIndexForFileEdit?.index]?.instrumentSheets?.[
                    tempIndexForFileEdit?.instrumentSheetIndex
                ]?.origFiles?.[tempIndexForFileEdit?.origFilesIndex]
            ) {
                musicPieces[tempIndexForFileEdit?.index].instrumentSheets[
                    tempIndexForFileEdit?.instrumentSheetIndex
                ].origFiles[tempIndexForFileEdit?.origFilesIndex].serializedCanvas =
                    serializedCanvas;

                setMusicPieces([...musicPieces]);
            }
        }

        if (pngs && tempIndexForFileEdit?.index) {
            if (
                musicPieces?.[tempIndexForFileEdit?.index]?.instrumentSheets?.[
                    tempIndexForFileEdit?.instrumentSheetIndex
                ]?.origFiles?.[tempIndexForFileEdit?.origFilesIndex]
            ) {
                musicPieces[tempIndexForFileEdit?.index].instrumentSheets[
                    tempIndexForFileEdit?.instrumentSheetIndex
                ].origFiles[tempIndexForFileEdit?.origFilesIndex].pngs = pngs;

                setMusicPieces([...musicPieces]);
            }
        }
        setTempFileInEdit(null);
        setTempSelectedVoicesInEdit(null);
        setTempMetaDataInEdit(null);
        /// TODO : enable SideBar
        setIsFileEditorVisible(false);
    };

    // handle add music piece
    const handleAddMusicPiece = () => {
        var temp = musicPieces;
        const newIndex = musicPieces.length;
        temp[newIndex] = {
            metaData: initialMetaData,
            selectedCast: null,
            instrumentSheets: [
                {
                    voices: [],
                    origFiles: [],
                },
            ],
            availableInstrumentVoices: [],
        };
        setMusicPieces([...temp]);
    };

    // handle metaData error update
    const updateErrors = (errors, index) => {
        if (musicPieces[index]) {
            if (!musicPieces[index].metaData) {
                console.warn('Invalid MetaData at index:', index);
            }
            musicPieces[index].metaData.errors = errors;
            setMusicPieces([...musicPieces]);
        } else {
            //console.warn('Invalid index:', index);
        }
    };

    // handle metaData update
    const setMetaData = (metaData, index) => {
        if (musicPieces[index]) {
            musicPieces[index].metaData = metaData;
            setMusicPieces([...musicPieces]);
        } else {
            //console.warn('Invalid index:', index);
        }
    };

    // handle cast update
    const updateCast = (selectedCast, index) => {
        if (musicPieces[index]) {
            if (
                musicPieces[index].selectedCast &&
                musicPieces[index].selectedCast?.id === selectedCast?.id
            )
                return;

            var tempMusicPiece = { ...musicPieces[index] };
            tempMusicPiece.selectedCast = selectedCast;
            // save all uploaded files and move them into an unassinged instrument sheet
            if (tempMusicPiece.instrumentSheets?.length > 0) {
                tempMusicPiece.instrumentSheets = [{ voices: [], origFiles: [] }];
                var temp = musicPieces[index].instrumentSheets?.map(instrumentSheet => {
                    if (instrumentSheet.origFiles?.length > 0) {
                        instrumentSheet.origFiles.map(file => {
                            tempMusicPiece.instrumentSheets[0].origFiles.push(file);
                        });
                    }
                });
                if (tempMusicPiece.instrumentSheets === undefined)
                    tempMusicPiece.instrumentSheets = [{ voices: [] }];
                temp = undefined;
            } else {
                tempMusicPiece.instrumentSheets = [{ voices: [], origFiles: [] }];
            }
            // reset available voices
            tempMusicPiece.availableInstrumentVoices = getInstrumentVoicesOfCast(
                selectedCast,
                tempMusicPiece.instrumentSheets
            );
            musicPieces[index] = tempMusicPiece;
            setMusicPieces([...musicPieces]);
        } else {
            //console.warn('Invalid index:', index);
        }
    };

    // handle instrumentSheets update
    const updateInstrumentSheets = (newInstrumentSheets, index) => {
        const updatedMusicPiece = { ...musicPieces[index] };
        updatedMusicPiece.instrumentSheets = newInstrumentSheets;
        updatedMusicPiece.availableInstrumentVoices = getAvailableVoices(
            updatedMusicPiece.selectedCast,
            updatedMusicPiece.instrumentSheets
        );

        musicPieces[index] = updatedMusicPiece;

        setMusicPieces([...musicPieces]);
    };

    // handle add voice to musicPiece
    const addNewVoiceToMusicPiece = (selectedVoice, index, instrumentSheetIndex) => {
        if (
            musicPieces[index] &&
            musicPieces[index].instrumentSheets[instrumentSheetIndex] &&
            musicPieces[index].instrumentSheets[instrumentSheetIndex].voices
        ) {
            musicPieces[index].instrumentSheets[instrumentSheetIndex].voices.push(selectedVoice);
            musicPieces[index].availableInstrumentVoices = getAvailableVoices(
                musicPieces[index].selectedCast,
                musicPieces[index].instrumentSheets
            );
            setMusicPieces([...musicPieces]);
        } else if (musicPieces[index]) {
            musicPieces[index].instrumentSheets[instrumentSheetIndex] = {
                ...musicPieces[index].instrumentSheets[instrumentSheetIndex],
                voices: [selectedVoice],
            };
            musicPieces[index].availableInstrumentVoices = getAvailableVoices(
                musicPieces[index].selectedCast,
                musicPieces[index].instrumentSheets
            );
            setMusicPieces([...musicPieces]);
        } else {
            //console.warn('Invalid index:', index);
        }
    };

    // handel metadata form visibility
    const handleMetadataIsVisibleStateChangeClose = () => {
        setMetadataIsVisible(false);
    };

    // handel metadata form visibility
    const handleMetadataIsVisibleStateChangeOpen = index => {
        setSelectedMusicPieceIndex(index);
        setMetadataIsVisible(true);
    };

    // handel visibillity state change
    const handeVisivillityStateChange = (isExpanded, isExpandedInstrumentSheets) => {
        setVisibillityStates({
            isExpanded: isExpanded,
            isExpandedInstrumentSheets: isExpandedInstrumentSheets,
        });
    };

    // handel voice selector visibility
    const handleOpenVoiceSelector = (index, instrumentSheetIndex) => {
        setSelectedMusicPieceIndex(index);
        setTempInstrumentSheetIndexForVoiceAdd(instrumentSheetIndex);
        setIsVoiceSelectorVisible(true);
    };

    // handel voice selector visibility
    const handleOnVoiceSelect = (voice, index) => {
        if (tempInstrumentSheetIndexForVoiceAdd != null)
            addNewVoiceToMusicPiece(voice, index, tempInstrumentSheetIndexForVoiceAdd);
        else addNewVoiceToMusicPiece(voice, index, 0);
        setIsVoiceSelectorVisible(false);
    };

    // handle voice remove from musicPiece
    const handleOnVoiceRemove = (voice, index, instrumentSheetIndex) => {
        musicPieces[index].instrumentSheets[instrumentSheetIndex].voices = musicPieces[
            index
        ].instrumentSheets[instrumentSheetIndex].voices.filter(v => v.voiceId !== voice.voiceId);

        musicPieces[index].availableInstrumentVoices = getAvailableVoices(
            musicPieces[index].selectedCast,
            musicPieces[index].instrumentSheets
        );
        setMusicPieces([...musicPieces]);
    };

    const handleAddEmptyInstrumentSheet = index => {
        var temp = musicPieces;
        temp[index].instrumentSheets.push({
            voices: [],
            origFiles: [],
        });
        setMusicPieces([...temp]);
    };

    const handleAddInstrumentSheetWithVoice = (index, voice, files) => {
        var temp = musicPieces;
        temp[index].instrumentSheets.push({
            voices: [],
            origFiles: [],
        });

        temp[index].instrumentSheets[temp[index].instrumentSheets.length - 1].voices.push(voice);
        files.map(originalFile => {
            const file = {
                name: originalFile.file.name,
                type: originalFile.extensionType,
                data: originalFile.dataUrlString,
                blob: originalFile?.blob ?? null,
                uuid: originalFile.uuid,
            };
            temp[index].instrumentSheets[temp[index].instrumentSheets.length - 1].origFiles.push(
                file
            );
        });

        temp[index].availableInstrumentVoices = getAvailableVoices(
            temp[index].selectedCast,
            temp[index].instrumentSheets
        );

        setMusicPieces([...temp]);
    };

    const handleAddInstrumentSheetToVoice = (index, voice, files) => {
        var temp = musicPieces;

        const instrumentSheetIndex = temp[index].instrumentSheets.findIndex(instrumentSheet =>
            instrumentSheet.voices.some(v => v.voiceId === voice.voiceId)
        );

        files.map(originalFile => {
            const file = {
                name: originalFile.file.name,
                type: originalFile.extensionType,
                data: originalFile.dataUrlString,
                blob: originalFile?.blob ?? null,
                uuid: originalFile.uuid,
            };
            temp[index].instrumentSheets[instrumentSheetIndex].origFiles.push(file);
        });

        temp[index].availableInstrumentVoices = getAvailableVoices(
            temp[index].selectedCast,
            temp[index].instrumentSheets
        );

        setMusicPieces([...temp]);
    };

    const handleDeleteMusicPiece = index => {
        if (musicPieces.length == 1) return;
        var temp = musicPieces.filter((_, i) => i != index);
        setMusicPieces([...temp]);
    };

    const handleDeleteInstrumentSheet = (index, instrumentSheetIndex) => {
        var temp = musicPieces[index]?.instrumentSheets;
        if (temp == null) return;
        temp = temp.filter((_, i) => i != instrumentSheetIndex);

        musicPieces[index].instrumentSheets = temp;

        musicPieces[index].availableInstrumentVoices = getAvailableVoices(
            musicPieces[index].selectedCast,
            musicPieces[index].instrumentSheets
        );

        setMusicPieces([...musicPieces]);
    };

    const handleDragEnd = event => {
        if (!event.over) return;
        const element =
            musicPieces[event.active.data.current.index]?.instrumentSheets[
                event.active.data.current.instrumentSheetIndex
            ]?.origFiles[event.active.data.current.fileIndex];

        if (!element) return;

        const updatedMusicPieces = [...musicPieces];

        updatedMusicPieces[event.over.data.current.index].instrumentSheets[
            event.over.data.current.instrumentSheetIndex
        ].origFiles.push(element);

        updatedMusicPieces[event.active.data.current.index].instrumentSheets[
            event.active.data.current.instrumentSheetIndex
        ].origFiles.splice(event.active.data.current.fileIndex, 1);

        setMusicPieces([...updatedMusicPieces]);
    };

    return (
        <div id="uploader-top">
            <UploaderContext.Provider
                value={{
                    user,
                    organisation,
                    implementationMode,
                    dispatchFlashMessage,
                    selectedMusicPieceIndex,
                    isMobile,
                    isMetadataVisible,
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
                            <div className="grid grid-cols-1 gap-4">
                                <div
                                    className="flex box w-full h-full"
                                    style={{
                                        flex: 1,
                                        visibility: isMetadataVisible ? 'visible' : 'hidden',
                                        position: isMetadataVisible ? 'relative' : 'absolute',
                                    }}
                                >
                                    {isMetadataVisible && (
                                        <MetaDataForm
                                            castOptions={castOptions}
                                            initialMetaData={
                                                musicPieces[selectedMusicPieceIndex]?.metaData
                                            }
                                            selectedCast={
                                                musicPieces[selectedMusicPieceIndex]?.selectedCast
                                            }
                                            handleUpdateErrors={updateErrors}
                                            handleMetaDataUpdate={setMetaData}
                                            handleCastChange={updateCast}
                                            onMetadataCloseClick={
                                                handleMetadataIsVisibleStateChangeClose
                                            }
                                        />
                                    )}
                                    {!isMetadataVisible && (
                                        <InfoPlaceholder numberOfNoteSheets={musicPieces.length} />
                                    )}
                                </div>
                                <div
                                    className="flex box w-full h-full"
                                    style={{
                                        flex: 1,
                                        visibility:
                                            isVoiceSelectorVisible && !isMetadataVisible
                                                ? 'visible'
                                                : 'hidden',
                                        position:
                                            isVoiceSelectorVisible && !isMetadataVisible
                                                ? 'relative'
                                                : 'absolute',
                                    }}
                                >
                                    {isVoiceSelectorVisible && (
                                        <UploadVoiceSelector
                                            filename={
                                                musicPieces[selectedMusicPieceIndex]?.metaData
                                                    ? musicPieces[selectedMusicPieceIndex]?.metaData
                                                          .title
                                                        ? musicPieces[selectedMusicPieceIndex]
                                                              ?.metaData.title
                                                        : t(
                                                              'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME'
                                                          )
                                                    : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')
                                            }
                                            instrumentation={
                                                musicPieces[selectedMusicPieceIndex]?.metaData
                                                    ? musicPieces[selectedMusicPieceIndex]?.metaData
                                                          .castName
                                                        ? musicPieces[selectedMusicPieceIndex]
                                                              ?.metaData.castName
                                                        : t(
                                                              'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION'
                                                          )
                                                    : t(
                                                          'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION'
                                                      )
                                            }
                                            voices={
                                                musicPieces[selectedMusicPieceIndex]?.selectedCast
                                                    ? mapCastToInstrumentVoices(
                                                          musicPieces[selectedMusicPieceIndex]
                                                              ?.selectedCast
                                                      )
                                                    : []
                                            }
                                            availableVoices={
                                                musicPieces[selectedMusicPieceIndex]
                                                    ?.availableInstrumentVoices
                                            }
                                            isMetadataVisible={isMetadataVisible}
                                            onVoiceClick={handleOnVoiceSelect}
                                            onMetadataEditClick={
                                                handleMetadataIsVisibleStateChangeOpen
                                            }
                                            onAddInstrumentSheetWithVoice={
                                                handleAddInstrumentSheetWithVoice
                                            }
                                            onAddInstrumentSheetToVoice={
                                                handleAddInstrumentSheetToVoice
                                            }
                                        />
                                    )}
                                </div>
                                <div
                                    className="flex box w-full h-full"
                                    style={{
                                        flex: 1,
                                        visibility:
                                            !isVoiceSelectorVisible && !isMetadataVisible
                                                ? 'visible'
                                                : 'hidden',
                                        position:
                                            !isVoiceSelectorVisible && !isMetadataVisible
                                                ? 'relative'
                                                : 'absolute',
                                    }}
                                >
                                    {!isVoiceSelectorVisible && (
                                        <UploadOverview
                                            musicPieces={musicPieces}
                                            visibillityStates={visibillityStates}
                                            onVisibillityStatesChange={handeVisivillityStateChange}
                                            onMetadataEditClick={
                                                handleMetadataIsVisibleStateChangeOpen
                                            }
                                            onInstrumentSheetsUpdate={updateInstrumentSheets}
                                            onVoiceClick={handleOnVoiceRemove}
                                            onAddVoiceClick={handleOpenVoiceSelector}
                                            onAddMusicPieceClick={handleAddMusicPiece}
                                            onAddUnnasignedInstrumentSheetClick={
                                                handleAddEmptyInstrumentSheet
                                            }
                                            onEditFileClick={handleOpenFileEditor}
                                            onDragEnd={handleDragEnd}
                                            onDelteMusicPiceClick={handleDeleteMusicPiece}
                                            onDeleteInstrumentSheetClick={
                                                handleDeleteInstrumentSheet
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {isVoiceSelectorVisible && (
                                    <UploadVoiceSelector
                                        filename={
                                            musicPieces[selectedMusicPieceIndex]?.metaData
                                                ? musicPieces[selectedMusicPieceIndex]?.metaData
                                                      .title
                                                    ? musicPieces[selectedMusicPieceIndex]?.metaData
                                                          .title
                                                    : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')
                                                : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')
                                        }
                                        instrumentation={
                                            musicPieces[selectedMusicPieceIndex]?.metaData
                                                ? musicPieces[selectedMusicPieceIndex]?.metaData
                                                      .castName
                                                    ? musicPieces[selectedMusicPieceIndex]?.metaData
                                                          .castName
                                                    : t(
                                                          'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION'
                                                      )
                                                : t(
                                                      'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION'
                                                  )
                                        }
                                        voices={
                                            musicPieces[selectedMusicPieceIndex]?.selectedCast
                                                ? mapCastToInstrumentVoices(
                                                      musicPieces[selectedMusicPieceIndex]
                                                          ?.selectedCast
                                                  )
                                                : []
                                        }
                                        availableVoices={
                                            musicPieces[selectedMusicPieceIndex]
                                                ?.availableInstrumentVoices
                                        }
                                        isMetadataVisible={isMetadataVisible}
                                        onVoiceClick={handleOnVoiceSelect}
                                        onMetadataEditClick={handleMetadataIsVisibleStateChangeOpen}
                                        onAddInstrumentSheetWithVoice={
                                            handleAddInstrumentSheetWithVoice
                                        }
                                        onAddInstrumentSheetToVoice={
                                            handleAddInstrumentSheetToVoice
                                        }
                                    />
                                )}
                                {!isVoiceSelectorVisible && (
                                    <UploadOverview
                                        musicPieces={musicPieces}
                                        visibillityStates={visibillityStates}
                                        onVisibillityStatesChange={handeVisivillityStateChange}
                                        onMetadataEditClick={handleMetadataIsVisibleStateChangeOpen}
                                        onInstrumentSheetsUpdate={updateInstrumentSheets}
                                        onVoiceClick={handleOnVoiceRemove}
                                        onAddVoiceClick={handleOpenVoiceSelector}
                                        onAddMusicPieceClick={handleAddMusicPiece}
                                        onAddUnnasignedInstrumentSheetClick={
                                            handleAddEmptyInstrumentSheet
                                        }
                                        onEditFileClick={handleOpenFileEditor}
                                        onDragEnd={handleDragEnd}
                                        onDelteMusicPiceClick={handleDeleteMusicPiece}
                                        onDeleteInstrumentSheetClick={handleDeleteInstrumentSheet}
                                    />
                                )}
                                {isMetadataVisible && (
                                    <MetaDataForm
                                        castOptions={castOptions}
                                        initialMetaData={
                                            musicPieces[selectedMusicPieceIndex]?.metaData
                                        }
                                        selectedCast={
                                            musicPieces[selectedMusicPieceIndex]?.selectedCast
                                        }
                                        handleUpdateErrors={updateErrors}
                                        handleMetaDataUpdate={setMetaData}
                                        handleCastChange={updateCast}
                                        onMetadataCloseClick={
                                            handleMetadataIsVisibleStateChangeClose
                                        }
                                    />
                                )}
                                {!isMetadataVisible && (
                                    <InfoPlaceholder numberOfNoteSheets={musicPieces.length} />
                                )}
                            </div>
                        )}
                    </div>
                    {isFileEditorVisible && (
                        <FileEditor
                            isOpen={isFileEditorVisible}
                            originalFile={tempFileInEdit}
                            editedCanvasProp={
                                tempFileInEdit?.serializedCanvas
                                    ? tempFileInEdit.serializedCanvas
                                    : null
                            }
                            onCloseClick={handelFileEditorClose}
                            onSaveClick={handelFileEditorSave}
                            selectedVoices={tempSelectedVoicesInEdit}
                            metaData={tempMetaDataInEdit}
                        ></FileEditor>
                    )}
                </UsagePermissionCheck>
            </UploaderContext.Provider>
        </div>
    );
};

export default MusicsheetUpload;
