import React, { useContext, useMemo } from 'react';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from '@material-ui/core/IconButton';
import { useDropzone } from 'react-dropzone';
import { UploaderContext } from '../context/UploaderContext';

const FileDropButton = ({
    index,
    instrumentSheetIndex,
    onDrop,
    allowedExtensions,
    handleUploadFileClick,
}) => {
    const { isMobile } = useContext(UploaderContext);

    const onDropWithIndexes = useMemo(
        () => onDrop(index, instrumentSheetIndex),
        [onDrop, index, instrumentSheetIndex]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDropWithIndexes,
    });

    return (
        <div
            {...getRootProps({ className: 'cursor-pointer' })}
            className={
                isMobile ? 'flex justify-end pl-24 pr-24' : 'box justify-end pt-24 pl-24 pr-24'
            }
            style={{ right: 0 }}
            id={index}
        >
            <input {...getInputProps()} accept={allowedExtensions} className="w-full h-full" />
            <IconButton aria-label="delete" style={{ right: 0 }} onClick={handleUploadFileClick}>
                <AttachFileIcon />
            </IconButton>
        </div>
    );
};
export default FileDropButton;
