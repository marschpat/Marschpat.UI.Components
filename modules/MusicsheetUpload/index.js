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

    const [castOptions, getInstrumentVoicesOfCast, getAvailableVoices] =
        useAvailableInstrumentHelper(implementationMode, organisation);

    // NEW AFTER REFACTORING
    const [musicPieces, setMusicPieces] = useState([]); // used | musicPieces for MusicPiece | scope MusicPieces
    const [selectedMusicPieceIndex, setSelectedMusicPieceIndex] = useState(0); // used | index of selected musicPiece | scope MusicPiece
    const [isMetadataVisible, setMetadataIsVisible] = useState(true); // used | toggles metadata form | scope Global
    const [isVoiceSelectorVisible, setIsVoiceSelectorVisible] = useState(true); // used | toggles voice selector | scope Global
    const [tempInstrumentSheetIndexForVoiceAdd, setTempInstrumentSheetIndexForVoiceAdd] =
        useState(null); // used | temp index for voice add | scope Global

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

        console.log('user ', user);
        console.log('organisation ', organisation);
        console.log('implementationMode ', implementationMode);

        // Add event listener on component mount for resize event
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Debugging Listener's ( TODO: remove )
    useEffect(() => {
        console.log('music Pieces after update: ', selectedMusicPieceIndex, musicPieces);
    }, [musicPieces]);

    // function to handle resize event
    const handleResize = () => {
        setIsMobile(window.innerWidth < 720);
    };

    // handle backend save here
    const handeSaveClicked = () => {
        console.log('Save clicked');
    };

    const handleAddMusicPiece = () => {
        console.log('Add music piece clicked');
        var temp = musicPieces;
        const newIndex = musicPieces.length;
        temp[newIndex] = {
            metaData: initialMetaData,
            selectedCast: null,
            instrumentSheets: [
                {
                    voices: [],
                },
            ],
            availableInstrumentVoices: [],
        };
        setMusicPieces([...temp]);
        setSelectedMusicPieceIndex(newIndex);
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

    const handleAddNewInstrumentSheet = (instrumentSheet, index) => {
        if (musicPieces[index]) {
            musicPieces[index].instrumentSheets.push(instrumentSheet);
            musicPieces[index].availableInstrumentVoices = getAvailableVoices(
                musicPieces[index].selectedCast,
                musicPieces[index].instrumentSheets
            );
            setMusicPieces([...musicPieces]);
        } else {
            //console.warn('Invalid index:', index);
        }
    };

    // handle instrumentSheets update
    const updateInstrumentSheets = (newInstrumentSheets, index) => {
        console.log('updateInstrumentSheets: ', newInstrumentSheets, index);

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

    const handleOpenVoiceSelector = (index, instrumentSheetIndex) => {
        setSelectedMusicPieceIndex(index);
        setTempInstrumentSheetIndexForVoiceAdd(instrumentSheetIndex);
        setIsVoiceSelectorVisible(true);
    };

    // handel voice selector visibility
    const handleOnVoiceSelect = (voice, index) => {
        console.log('Voice selected: ', voice, index);
        if (tempInstrumentSheetIndexForVoiceAdd != null)
            addNewVoiceToMusicPiece(voice, index, tempInstrumentSheetIndexForVoiceAdd);
        else addNewVoiceToMusicPiece(voice, index, 0);
        setIsVoiceSelectorVisible(false);
    };

    // handle voice remove from musicPiece
    const handleOnVoiceRemove = (voice, index, instrumentSheetIndex) => {
        console.log('Voice removed: ', voice, index, instrumentSheetIndex);
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
        console.log('Add empty instrument sheet clicked', index);
        var temp = musicPieces;
        temp[index].instrumentSheets.push({
            voices: [],
            origFiles: [],
        });
        setMusicPieces([...temp]);
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
                            <div>
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
                                        initialMetaData={
                                            musicPieces[selectedMusicPieceIndex]?.metaData
                                        }
                                        handleUpdateErrors={updateErrors}
                                        handleMetaDataUpdate={setMetaData}
                                        handleCastChange={updateCast}
                                        isVisible={isMetadataVisible}
                                        onMetadataCloseClick={
                                            handleMetadataIsVisibleStateChangeClose
                                        }
                                    />
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
                                        availableVoices={
                                            musicPieces[selectedMusicPieceIndex]
                                                ?.availableInstrumentVoices
                                        }
                                        isMetadataVisible={isMetadataVisible}
                                        onVoiceClick={handleOnVoiceSelect}
                                        onMetadataEditClick={handleMetadataIsVisibleStateChangeOpen}
                                    />
                                )}
                                {!isVoiceSelectorVisible && (
                                    <UploadOverview
                                        musicPieces={musicPieces}
                                        onMetadataEditClick={handleMetadataIsVisibleStateChangeOpen}
                                        onInstrumentSheetsUpdate={updateInstrumentSheets}
                                        onVoiceClick={handleOnVoiceRemove}
                                        onAddVoiceClick={handleOpenVoiceSelector}
                                        onAddMusicPieceClick={handleAddMusicPiece}
                                        onAddUnnasignedInstrumentSheetClick={
                                            handleAddEmptyInstrumentSheet
                                        }
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
                </UsagePermissionCheck>
            </UploaderContext.Provider>
        </div>
    );
};

export default MusicsheetUpload;
