import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import FileHelper from '../../utils/FileHelper';
import { generateInstrumentSheet } from '../../utils/InstrumentSheetsHelper';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useTranslation } from 'react-i18next';

const FileDropzone = props => {
    const allowedExtensions = ['.mxl', '.musicxml', '.pdf', '.png', '.jpg', '.jpeg'];
    const [originalFiles, setOriginalFiles] = useState(null);

    const { t } = useTranslation(['uploader']);
    /**
     * Validate dropped files, set them as originalFiles and later pass them to parent as handleInstrumentSheetsUpdate.
     * All file types are readed as dataUri string (reader.readAsDataURL), except `mxl` files.
     * MXL files are reades as BinaryString, and therefore provide a `blob` attribute
     * (necessary cause it seems OSMD is best in handling binary file blobs).
     */
    const onDrop = useCallback(acceptedFiles => {
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

    useEffect(() => {
        if (originalFiles) {
            // Generate the initial instrumentSheet objects for each dropped original file
            const allInstrumentSheets = originalFiles.map(file => generateInstrumentSheet(file));

            props.handleInstrumentSheetsUpdate(allInstrumentSheets);
            setOriginalFiles(null);
        }
    }, [originalFiles]);

    // Reset FileDropzone back to initial state
    useEffect(() => {
        if (props.resetState) {
            setOriginalFiles(null);
        }
    }, [props.resetState]);

    return (
        <section className="mt-20">
            <div
                {...getRootProps({
                    className:
                        'h-192 w-full flex justify-center items-center border-dashed border-4 border-gray-300 rounded-md cursor-pointer',
                })}
                id="file-dropzone"
            >
                <input {...getInputProps()} accept={allowedExtensions} />
                <div className="flex flex-col items-center text-gray-400">
                    <CloudUploadIcon style={{ fontSize: 120 }} />
                    <Typography variant="h6">{t('UPLOADER_FILEDROPZONE')}</Typography>
                </div>
            </div>
        </section>
    );
};

export default FileDropzone;
