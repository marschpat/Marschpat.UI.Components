import React, { useContext, useMemo, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { useDropzone } from 'react-dropzone';
import { UploaderContext } from '../context/UploaderContext';
import { useTranslation } from 'react-i18next';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const NotesOverview = ({
    instrumentSheet,
    index,
    instrumentSheetIndex,
    onDrop,
    allowedExtensions,
    onAddFileClick,
    onEditFileClick,
    onDuplicateFileClick,
    onDeleteFileClick,
}) => {
    const { isMobile } = useContext(UploaderContext);
    const { t } = useTranslation(['uploader']);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const onDropWithIndexes = useMemo(
        () => onDrop(index, instrumentSheetIndex),
        [onDrop, index, instrumentSheetIndex]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDropWithIndexes,
    });

    const getDisplayFilename = filename => {
        if (!filename) return null;

        // Extract base filename and extension
        const fileBaseName = filename.split('.').slice(0, -1).join('.');
        const fileExtension = filename.split('.').pop();

        // Determine max length based on device type
        const maxLength = isMobile ? 16 : 28;

        // If the filename is longer than maxLength, shorten and add ellipsis, preserving extension
        if (fileBaseName.length > maxLength) {
            return `${fileBaseName.slice(0, maxLength)}...${fileExtension}`;
        } else {
            return filename;
        }
    };

    const NumberCircle = ({ number }) => {
        return (
            <div className="w-24 h-24 bg-gray-800 text-white p-8 rounded-full flex items-center justify-center mr-8">
                <span className="text-s">{number}</span>
            </div>
        );
    };

    const FileElement = ({ file, i }) => {
        const { attributes, listeners, setNodeRef, isOver, transform } = useDraggable({
            id: `file-${index}-${instrumentSheetIndex}-${i}`,
            snapToCursor: true,
            data: {
                type: 'instrumentSheetFile',
                index: index,
                instrumentSheetIndex: instrumentSheetIndex,
                fileIndex: i,
            },
        });

        const style = {
            transform: CSS.Translate.toString(transform),
            color: isOver ? 'green' : undefined,
        };

        return (
            <div
                key={i}
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                className="grid grid-cols-2 pl-8 pb-4 w-full"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={style}
            >
                <div className="flex flex-row justify-start w-full" style={{ right: 0 }}>
                    <NumberCircle number={i + 1} />
                    <p className="text-s pt-2">{getDisplayFilename(file?.name)}</p>
                </div>
                <div className="flex flex-row justify-end w-full" style={{ right: 0 }}>
                    <IconButton
                        className={`bg-gray-200 h-16 w-16 mr-8 ${
                            hoveredIndex === i && !isMobile ? '' : 'hidden'
                        } transition-opacity duration-300`}
                        onClick={() => {
                            if (!isMobile) onEditFileClick(index, instrumentSheetIndex, i);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
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

    return (
        <div className="flex flex-wrap w-full">
            <div className="flex flex-col justify-start items-start w-full">
                {instrumentSheet?.origFiles?.length > 0 &&
                    instrumentSheet?.origFiles.map((file, i) => {
                        return <FileElement key={i} file={file} i={i} />;
                    })}
            </div>
            <div {...getRootProps({ className: 'cursor-pointer' })} id={index}>
                <input {...getInputProps()} accept={allowedExtensions} className="w-full h-full" />
                <Button
                    className="rounded-full flex items-start h-32 mt-8"
                    onClick={onAddFileClick}
                >
                    <AddCircleOutlineIcon
                        className="bg-gray-200 h-24 w-24 mr-8"
                        style={{
                            color: 'rgb(220, 173, 85)',
                            active: { color: 'rgb(220, 173, 85)' },
                            hover: { color: 'rgb(220, 173, 85)' },
                        }}
                    />
                    <span
                        className="text-s font-normal not-uppercase"
                        style={{
                            textTransform: 'none',
                            color: 'rgb(220, 173, 85)',
                            active: { color: 'rgb(220, 173, 85)' },
                            hover: { color: 'rgb(220, 173, 85)' },
                        }}
                    >
                        {t('UPlOADER_ADD_MUSICSHEET')}
                    </span>
                </Button>
            </div>
        </div>
    );
};
export default NotesOverview;
