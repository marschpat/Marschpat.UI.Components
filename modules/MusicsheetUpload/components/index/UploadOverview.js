import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import EmbedVideo from './EmbedVideo';
import BrowserSupportNote from './BrowserSupportNote';
import { UploaderContext } from '../../context/UploaderContext';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CollapseButton from '../../utils/CollapseButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from '@material-ui/core/IconButton';
import FileHelper from '../../utils/FileHelper';
import { useDropzone } from 'react-dropzone';
import { generateInstrumentSheet } from '../../utils/InstrumentSheetsHelper';

const UploadOverview = ({
    filename,
    instrumentation,
    onMetadataEditClick,
    isMetadataVisible,
    isMobile,
    onVoiceAddClick,
    onInstrumentSheetsUpdate,
    musicPieces,
    currentMusicPieceId,
}) => {
    const { t } = useTranslation(['uploader']);
    const { implementationMode } = useContext(UploaderContext);
    const [isExpanded, setIsExpanded] = useState(true);
    const allowedExtensions = ['.mxl', '.musicxml', '.pdf', '.png', '.jpg', '.jpeg'];
    const [originalFiles, setOriginalFiles] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
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
                    setOriginalFiles(files);
                }
            })
            .catch(error => {
                console.error('FileDropzone Error: ', error);
            });
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleExpandStateChange = newState => {
        setIsExpanded(newState);
    };

    const getDisplayFilename = () => {
        if (isMobile) {
            if (filename.length > 16) return filename.slice(0, 16) + '...';
            else return filename;
        }

        if (filename.length > 22) return filename.slice(0, 22) + '...';
        else return filename;
    };

    const handleUploadFileClick = () => {
        console.log('UploadFileClick');
    };

    useEffect(() => {
        console.log('OriginalFiles: ', originalFiles);
        if (originalFiles) {
            // Generate the initial instrumentSheet objects for each dropped original file
            const allInstrumentSheets = originalFiles.map(file => generateInstrumentSheet(file));

            onInstrumentSheetsUpdate(allInstrumentSheets);
            setOriginalFiles(null);
        }
    }, [originalFiles]);

    return (
        <section className="block w-full h-full p-6 mr-6 bg-gray-200  border border-gray-200 shadow pb-24">
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
                            isExpanded={isExpanded}
                            onStateChange={handleExpandStateChange}
                        />
                    </div>
                )}
                <div className="flex justify-between items-center w-full">
                    <Button
                        variant="contained"
                        disableElevation={true}
                        className={
                            isMobile
                                ? 'flex justify-between w-full m-24 rounded-md text-black transition-colors bg-gray-200 active:bg-gray-200 hover:bg-gray-200 focus:outline-none text-clip'
                                : 'group flex justify-start items-center mt-24 rounded-md text-black transition-colors bg-gray-200 active:bg-gray-200 hover:bg-gray-200 focus:outline-none text-clip'
                        }
                        style={{ textTransform: 'none' }}
                        onClick={onMetadataEditClick}
                    >
                        <div className="flex flex-col items-start justify-start">
                            <div
                                className="text-lg font-light italic text-left"
                                style={{ padding: 0, margin: 0 }}
                            >
                                {getDisplayFilename()}
                            </div>
                            <div
                                className="text-s font-light text-black"
                                style={{ padding: 0, margin: 0 }}
                            >
                                {instrumentation}
                            </div>
                        </div>
                        <EditIcon className="ml-24" style={{ right: 0 }} />
                    </Button>
                    <div
                        {...getRootProps({
                            className: 'cursor-pointer',
                        })}
                        className={
                            isMobile
                                ? 'flex justify-end pl-24 pr-24'
                                : 'box justify-end pt-24 pl-24 pr-24'
                        }
                        style={{ right: 0 }}
                        id="file-dropzone"
                    >
                        <input
                            {...getInputProps()}
                            accept={allowedExtensions}
                            className="w-full h-full"
                        />
                        <IconButton
                            aria-label="delete"
                            style={{ right: 0 }}
                            onClick={handleUploadFileClick}
                        >
                            <AttachFileIcon></AttachFileIcon>
                        </IconButton>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <BrowserSupportNote />
                    <EmbedVideo />
                </div>
            </div>
            {calcVisible() && <div className="flex flex-col pl-16"></div>}
        </section>
    );

    function calcVisible() {
        if (!isMobile) return isExpanded;
        else {
            return isExpanded && !isMetadataVisible;
        }
    }
};

export default UploadOverview;
