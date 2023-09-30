import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { UploaderContext } from '../context/UploaderContext';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CollapseButton from '../utils_2.0/CollapseButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from '@material-ui/core/IconButton';
import FileHelper from '../utils/FileHelper';
import VoiceButton from '../utils_2.0/VoiceButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddIcon from '@material-ui/icons/Add';
import FileDropButton from '../utils_2.0/FileDropButton';
import { generateInstrumentSheet } from '../utils/InstrumentSheetsHelper';
import { get, set } from 'lodash';

const UploadOverview = ({
    musicPieces,
    onMetadataEditClick,
    onInstrumentSheetsUpdate,
    onVoiceClick,
    onAddVoiceClick,
    onAddMusicPieceClick,
}) => {
    const { t } = useTranslation(['uploader']);
    const { selectedMusicPieceIndex, isMobile, isMetadataVisible } = useContext(UploaderContext);
    const [isExpanded, setIsExpanded] = useState([]);
    const [isExpandedInstrumentSheet, setIsExpandedInstrumentSheet] = useState([], []);
    const allowedExtensions = ['.mxl', '.musicxml', '.pdf', '.png', '.jpg', '.jpeg'];
    const [originalFiles, setOriginalFiles] = useState(null);
    const [tempDropLocation, setTempDropLocation] = useState(null);

    useEffect(() => {
        Object.keys(musicPieces).forEach(index => {
            isExpanded[index] = true;
        });
    }, []);

    useEffect(() => {
        console.log('isExpanded: ', isExpanded);
    }, [isExpanded]);

    const onDrop = useCallback(
        (pieceIndex, sheetIndex) => acceptedFiles => {
            console.log('Dropped on: ', pieceIndex, sheetIndex);
            console.log('FileObject: ', acceptedFiles);
            const validatedFiles = acceptedFiles
                .filter(file => FileHelper.validateFileExtension(file, allowedExtensions))
                .map(file => {
                    const fileObject = FileHelper.populateFileObject(file);

                    // special for mxl file types
                    if (fileObject.extensionType === 'mxl') {
                        return FileHelper.readAsBinaryString(fileObject);
                    }

                    // default for all file types
                    return FileHelper.readFileAsDataUrl(fileObject);
                });
            Promise.all(validatedFiles)
                .then(files => {
                    if (files && files.length > 0) {
                        console.log('set tempDropLocation: ', pieceIndex, sheetIndex);
                        setTempDropLocation({ pieceIndex, sheetIndex });
                        setOriginalFiles(files);
                    }
                })
                .catch(error => {
                    console.error('FileDropzone Error: ', error);
                });
        },
        []
    );

    const getUnassingedInstrumentSheetsIndex = index => {
        console.log(
            'getUnassingedInstrumentSheetsIndex: ',
            index,
            musicPieces?.[index]?.instrumentSheets?.length
        );
        if (musicPieces?.[index]?.instrumentSheets?.length === 0) return 0;
        else if (
            musicPieces?.[index]?.instrumentSheets?.[
                musicPieces?.[index]?.instrumentSheets?.length - 1
            ].voices === undefined
        )
            return musicPieces?.[index]?.instrumentSheets?.length - 1;
        else return musicPieces?.[index]?.instrumentSheets?.length;
    };

    const getDisplayFilename = filename => {
        if (isMobile) {
            if (filename.length > 16) return filename.slice(0, 16) + '...';
            else return filename;
        }

        if (filename.length > 22) return filename.slice(0, 22) + '...';
        else return filename;
    };

    const handleUploadFileClick = obj => {
        console.log('UploadFileClick', obj);
    };

    const handleOnVoiceRemoveClick = (voice, index, instrumentSheetIndex) => {
        console.log('handleOnVoiceClick: ', voice, index);
        onVoiceClick(voice, index, instrumentSheetIndex);
    };

    const handleVoiceAddClick = (index, instrumentSheetIndex) => {
        console.log('handleVoiceAddClick: ', index, instrumentSheetIndex);
        onAddVoiceClick(index, instrumentSheetIndex);
    };

    const getExpandedOfMusicPiece = index => {
        if (isExpanded[index] === undefined) {
            return true;
        } else {
            return isExpanded[index];
        }
    };

    const getExpandedOfInstrumentSheet = (index, instrumentSheetIndex) => {
        if (isExpandedInstrumentSheet[(index, instrumentSheetIndex)] === undefined) {
            return true;
        } else {
            return isExpandedInstrumentSheet[(index, instrumentSheetIndex)];
        }
    };

    useEffect(() => {
        console.log('tempDropLocation: ', tempDropLocation);
        console.log('OriginalFiles: ', originalFiles);
        if (originalFiles && tempDropLocation !== null) {
            // Generate the initial instrumentSheet objects for each dropped original file
            const allInstrumentSheets = originalFiles.map(file => generateInstrumentSheet(file));

            var tempInstrumentSheets = [
                ...musicPieces[tempDropLocation.pieceIndex]?.instrumentSheets,
            ];

            console.log('tempInstrumentSheets: ', tempInstrumentSheets);
            console.log('tempDropLocation: ', tempDropLocation);
            console.log('allInstrumentSheets: ', allInstrumentSheets);

            if (!tempInstrumentSheets[tempDropLocation.sheetIndex])
                tempInstrumentSheets[tempDropLocation.sheetIndex] = { origFiles: [] };

            if (!tempInstrumentSheets[tempDropLocation.sheetIndex].origFiles)
                tempInstrumentSheets[tempDropLocation.sheetIndex].origFiles = [];

            allInstrumentSheets.forEach(instrumentSheet => {
                tempInstrumentSheets[tempDropLocation.sheetIndex].origFiles.push(
                    instrumentSheet.origFiles[0]
                );
            });

            onInstrumentSheetsUpdate(
                tempInstrumentSheets,
                tempDropLocation?.pieceIndex,
                tempDropLocation?.sheetIndex
            );
            setTempDropLocation(null);
            setOriginalFiles(null);
        }
    }, [originalFiles]);

    return (
        <section className="block w-full h-wrap p-6 mr-6 bg-gray-200 border border-gray-200 shadow pb-24">
            {Object.keys(musicPieces).length > 0 &&
                Object.keys(musicPieces).map(index => {
                    return (
                        <div>
                            <div
                                className={
                                    isMobile
                                        ? 'relative flex items-center justify-center w-full'
                                        : 'relative w-full flex items-center'
                                }
                            >
                                {!isMobile && (
                                    <div className="App flex space-x-4 mt-36">
                                        <CollapseButton
                                            isExpanded={getExpandedOfMusicPiece(index)}
                                            onStateChange={state => {
                                                const newExpanded = [...isExpanded];
                                                newExpanded[index] = state;
                                                setIsExpanded([...newExpanded]);
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="flex justify-between items-center w-full grid-cols-1">
                                    <Button
                                        variant="contained"
                                        disableElevation={true}
                                        className={
                                            isMobile
                                                ? 'flex justify-between w-full m-24 rounded-md text-black transition-colors bg-gray-200 active:bg-gray-200 hover:bg-gray-200 focus:outline-none text-clip'
                                                : 'group flex justify-start items-center mt-24 rounded-md text-black transition-colors bg-gray-200 active:bg-gray-200 hover:bg-gray-200 focus:outline-none text-clip'
                                        }
                                        style={{ textTransform: 'none' }}
                                        onClick={() => onMetadataEditClick(index)}
                                    >
                                        <div className="flex flex-col items-start justify-start">
                                            <div
                                                className="text-lg font-light italic text-left"
                                                style={{ padding: 0, margin: 0 }}
                                            >
                                                {getDisplayFilename(
                                                    musicPieces[index]?.metaData
                                                        ? musicPieces[index]?.metaData.title
                                                            ? musicPieces[index]?.metaData.title
                                                            : t(
                                                                  'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME'
                                                              )
                                                        : t(
                                                              'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME'
                                                          )
                                                )}
                                            </div>
                                            <div
                                                className="text-s font-light text-black"
                                                style={{ padding: 0, margin: 0 }}
                                            >
                                                {musicPieces[index]?.selectedCast
                                                    ? musicPieces[index]?.selectedCast.label
                                                    : t(
                                                          'UPLOADER_MUSICPIECESUPLOADED_DEFAULT_INSTRUMENTATION'
                                                      )}
                                            </div>
                                        </div>
                                        <EditIcon className="ml-24" style={{ right: 0 }} />
                                    </Button>
                                    <FileDropButton
                                        index={index}
                                        instrumentSheetIndex={getUnassingedInstrumentSheetsIndex(
                                            index
                                        )}
                                        onDrop={onDrop}
                                        allowedExtensions={allowedExtensions}
                                    />
                                </div>
                            </div>
                            <div>
                                {calcVisible(index) && (
                                    <div className="flex grid grid-col-1 !pl-8">
                                        {musicPieces?.[index]?.instrumentSheets &&
                                            Object.keys(musicPieces[index].instrumentSheets)
                                                .length > 0 &&
                                            Object.keys(musicPieces[index].instrumentSheets).map(
                                                instrument => (
                                                    <div className="flex flex-cols-2">
                                                        {musicPieces[index].instrumentSheets[
                                                            instrument
                                                        ]?.voices &&
                                                            musicPieces[index].instrumentSheets[
                                                                instrument
                                                            ].voices.length > 0 && (
                                                                <div className="flex pl-12 pt-8 h-48 w-48">
                                                                    <CollapseButton></CollapseButton>
                                                                </div>
                                                            )}
                                                        <div className="flex flex-wrap pl-12">
                                                            {musicPieces[index].instrumentSheets[
                                                                instrument
                                                            ]?.voices &&
                                                                musicPieces[index].instrumentSheets[
                                                                    instrument
                                                                ].voices.length > 0 &&
                                                                musicPieces[index].instrumentSheets[
                                                                    instrument
                                                                ].voices.map(
                                                                    (voice, voiceIndex) => (
                                                                        <div className="flex flex-wrap">
                                                                            <VoiceButton
                                                                                voice={voice}
                                                                                onVoiceClick={() =>
                                                                                    handleOnVoiceRemoveClick(
                                                                                        voice,
                                                                                        index,
                                                                                        instrument
                                                                                    )
                                                                                }
                                                                            />
                                                                            {voiceIndex ===
                                                                                musicPieces[index]
                                                                                    .instrumentSheets[
                                                                                    instrument
                                                                                ].voices.length -
                                                                                    1 && (
                                                                                <IconButton
                                                                                    onClick={() =>
                                                                                        handleVoiceAddClick(
                                                                                            index,
                                                                                            instrument
                                                                                        )
                                                                                    }
                                                                                    className="bg-gray-200 mt-16"
                                                                                    style={{
                                                                                        height: '32px',
                                                                                        width: '32px',
                                                                                    }}
                                                                                >
                                                                                    <AddCircleOutlineIcon />
                                                                                </IconButton>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        {(!musicPieces?.[index]?.instrumentSheets?.length ||
                                            musicPieces?.[index]?.instrumentSheets?.some(
                                                sheet =>
                                                    !sheet.voices ||
                                                    !Object.keys(sheet.voices).length
                                            )) && (
                                            <div className="flex flex-wrap">
                                                <div className="flex pl-12 pt-8 h-48">
                                                    <CollapseButton></CollapseButton>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <span className="text-lg font-light italic text-left not-uppercase !p-8 pt-16 pl-0 mr-12">
                                                        {t('UPLOADER_MUSICPIECESUPLOADED_NO_VOICE')}
                                                    </span>
                                                    <Button
                                                        variant="contained"
                                                        className="flex items-center bg-white mt-12 mr-12 !p-8 pl-16 pr-16 rounded-full text-black"
                                                        style={{ textTransform: 'none' }}
                                                        onClick={() =>
                                                            handleVoiceAddClick(
                                                                index,
                                                                musicPieces?.[index]
                                                                    ?.instrumentSheets?.length - 1
                                                            )
                                                        }
                                                    >
                                                        <span className="text-s not-uppercase">
                                                            {t(
                                                                'UPLOADER_MUSICPIECESUPLOADED_SELECT_VOICE'
                                                            )}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="fex w-full h-6 bg-grey-300 mt-16 rounded-full"></div>
                        </div>
                    );
                })}
            <div className="flex flex-wrap mt-16">
                <Button
                    className="rounded-full"
                    style={{ textTransform: 'none' }}
                    onClick={onAddMusicPieceClick}
                >
                    <IconButton className="bg-gray-300">
                        <AddIcon />
                    </IconButton>
                    <span className="text-gray-800 text-xl font-normal not-uppercase pl-16">
                        {t('UPlOADER_ADD_MUSICPIECE')}
                    </span>
                </Button>
            </div>
        </section>
    );

    function calcVisible(index) {
        if (!isMobile) return getExpandedOfMusicPiece(index);
        else {
            return getExpandedOfMusicPiece(index) && !isMetadataVisible;
        }
    }

    function checkNullOrUndefinedOrEmptyArray(obj) {
        return !(obj === null || obj === undefined || obj?.length === 0);
    }
};

export default UploadOverview;
