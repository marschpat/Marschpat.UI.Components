import React, { useContext, useMemo, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { UploaderContext } from '../context/UploaderContext';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const FILE_TYPE = 'FILE';

const DraggableFile = ({
    file,
    index,
    i,
    instrumentSheetIndex,
    moveFile,
    onDeleteFileClick,
    onDuplicateFileClick,
}) => {
    const { isMobile } = useContext(UploaderContext);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const [, ref] = useDrag({
        type: FILE_TYPE,
        item: { index },
    });

    const NumberCircle = ({ number }) => {
        return (
            <div className="w-24 h-24 bg-gray-800 text-white p-8 rounded-full flex items-center justify-center mr-8">
                <span className="text-s">{number}</span>
            </div>
        );
    };

    const getDisplayFilename = filename => {
        if (!filename) return null;

        // Extract base filename and extension
        const fileBaseName = filename.split('.').slice(0, -1).join('.');
        const fileExtension = filename.split('.').pop();

        // Determine max length based on device type
        const maxLength = isMobile ? 16 : 22;

        // If the filename is longer than maxLength, shorten and add ellipsis, preserving extension
        if (fileBaseName.length > maxLength) {
            return `${fileBaseName.slice(0, maxLength)}...${fileExtension}`;
        } else {
            return filename;
        }
    };

    const [, drop] = useDrop({
        accept: FILE_TYPE,
        hover(item, monitor) {
            if (item.index !== index) {
                moveFile(item.index, index);
                item.index = index;
            }
        },
    });

    return (
        <div
            ref={node => ref(drop(node))}
            className="flex flex-row justify-between items-start pl-8 pb-4 w-full"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <NumberCircle number={i + 1} />
            <p className="text-s pt-2 w-full" style={{ textAlign: 'left' }}>
                {getDisplayFilename(file?.name)}
            </p>
            <div className="flex flex-row justify-end items-end">
                <IconButton
                    className={`bg-gray-200 h-16 w-16 mr-8 ${
                        hoveredIndex === i ? '' : 'hidden'
                    } transition-opacity duration-300`}
                    onClick={() => onDuplicateFileClick(index, instrumentSheetIndex, i)}
                >
                    <FileCopyIcon />
                </IconButton>
                <IconButton
                    className={`bg-gray-200 h-16 w-16 mr-8 ${
                        hoveredIndex === i ? '' : 'hidden'
                    } transition-opacity duration-300`}
                    onClick={() => onDeleteFileClick(index, instrumentSheetIndex, i)}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    );
};

const NotesOverview = ({
    instrumentSheet,
    index,
    instrumentSheetIndex,
    onDrop,
    allowedExtensions,
    onAddFileClick,
    onDuplicateFileClick,
    onDeleteFileClick,
}) => {
    const [origFiles, setOrigFiles] = useState(instrumentSheet?.origFiles || []);
    const { t } = useTranslation(['uploader']);

    const moveFile = useCallback(
        (fromIndex, toIndex) => {
            const updatedFiles = [...origFiles];
            const [movedFile] = updatedFiles.splice(fromIndex, 1);
            updatedFiles.splice(toIndex, 0, movedFile);
            setOrigFiles(updatedFiles);
            // Perform any update to parent component or server if needed
        },
        [origFiles]
    );

    const onDropWithIndexes = useMemo(
        () => onDrop(index, instrumentSheetIndex),
        [onDrop, index, instrumentSheetIndex]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDropWithIndexes,
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-wrap">
                <input {...getInputProps()} accept={allowedExtensions} className="w-full h-full" />
                <div className="flex flex-col justify-start items-start w-full">
                    {origFiles.length > 0 &&
                        origFiles.map((file, i) => (
                            <DraggableFile
                                key={i}
                                file={file}
                                index={index}
                                i={i}
                                instrumentSheetIndex={instrumentSheetIndex}
                                onDeleteFileClick={onDeleteFileClick}
                                onDuplicateFileClick={onDuplicateFileClick}
                                moveFile={moveFile}
                                /* other needed props */
                            />
                        ))}
                </div>
                <div {...getRootProps({ className: 'cursor-pointer' })} id={index}>
                    <Button
                        className="rounded-full flex items-start h-32 mt-8"
                        style={{
                            textTransform: 'none',
                            color: 'rgb(220, 173, 85) !important',
                            active: { color: 'rgb(220, 173, 85) !important' },
                            hover: { color: 'rgb(220, 173, 85) !important' },
                        }}
                        onClick={onAddFileClick}
                    >
                        <IconButton className="bg-gray-200 h-24 w-24 mr-8">
                            <AddCircleOutlineIcon
                                style={{
                                    color: 'rgb(220, 173, 85) !important',
                                    active: { color: 'rgb(220, 173, 85) !important' },
                                    hover: { color: 'rgb(220, 173, 85) !important' },
                                }}
                            />
                        </IconButton>
                        <span className="text-gray-800 text-s font-normal not-uppercase">
                            {t('UPlOADER_ADD_MUSICSHEET')}
                        </span>
                    </Button>
                </div>
            </div>
        </DndProvider>
    );
};

export default NotesOverview;
