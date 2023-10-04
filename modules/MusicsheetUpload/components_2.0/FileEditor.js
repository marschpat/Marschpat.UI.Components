import React, { useState, useEffect, useContext, useRef } from 'react';
import { UploaderContext } from '../context/UploaderContext';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SafeButton from '../utils_2.0/SafeButton';

const FileEditor = ({ isOpen, originalFile, onCloseClick, metaData, selectedVoices }) => {
    const { isMobile } = useContext(UploaderContext);
    const { t } = useTranslation(['uploader']);

    useEffect(() => {
        console.log('Opened Fullscreen Editor');
        console.log('originalFile: ', originalFile);
        console.log('metaData: ', metaData);
        console.log('selectedVoices: ', selectedVoices);
        console.log('isOpen: ', isOpen);
    }, []);

    const handleCloseClick = () => {
        onCloseClick();
    };

    const handleSaveClicked = () => {
        console.log('Save Editor clicked');
        onCloseClick();
    };

    const getDisplayVoices = () => {
        console.log('selectedVoices.length: ', selectedVoices.length);
        if (selectedVoices.length == 1) return selectedVoices?.[0]?.name;
        else if (selectedVoices.length > 1) return selectedVoices?.[0]?.name + ', ...';
        else return t('UPLOADER_MUSICPIECESUPLOADED_NO_VOICE');
    };

    const getDisplayFilename = filename => {
        if (!filename) return null;

        // Extract base filename and extension
        const fileBaseName = filename.split('.').slice(0, -1).join('.');
        const fileExtension = filename.split('.').pop();

        // Determine max length based on device type
        const maxLength = isMobile ? 16 : 32;

        // If the filename is longer than maxLength, shorten and add ellipsis, preserving extension
        if (fileBaseName.length > maxLength) {
            return `${fileBaseName.slice(0, maxLength)}...${fileExtension}`;
        } else {
            return filename;
        }
    };

    const FileInfo = () => {
        return (
            <div className="flex flex-col h-full">
                <span className="text-lg">
                    {t('EDITOR_VOICES_IN_EDIT_1') +
                        ' "' +
                        getDisplayVoices() +
                        '" ' +
                        t('EDITOR_VOICES_IN_EDIT_2')}
                </span>
                <span className="text-s text-grey-300">
                    {getDisplayFilename(originalFile.name)}
                </span>
            </div>
        );
    };

    const Base64Prefix = 'data:application/pdf;base64,';
    function getPdfHandler() {
        return window['pdfjs-dist/build/pdf'];
    }

    function readBlob(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result));
            reader.addEventListener('error', reject);
            reader.readAsDataURL(blob);
        });
    }

    async function printPDF(pdfData, pages) {
        const pdfjsLib = await getPdfHandler();
        pdfData = pdfData instanceof Blob ? await readBlob(pdfData) : pdfData;
        const data = atob(
            pdfData.startsWith(Base64Prefix) ? pdfData.substring(Base64Prefix.length) : pdfData
        );
        // Using DocumentInitParameters object to load binary data.
        const loadingTask = pdfjsLib.getDocument({ data });
        return loadingTask.promise.then(pdf => {
            const numPages = pdf.numPages;
            return new Array(numPages).fill(0).map((__, i) => {
                const pageNumber = i + 1;
                if (pages && pages.indexOf(pageNumber) == -1) {
                    return;
                }
                return pdf.getPage(pageNumber).then(page => {
                    //  retina scaling
                    const viewport = page.getViewport({ scale: window.devicePixelRatio });
                    // Prepare canvas using PDF page dimensions
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    // Render PDF page into canvas context
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    const renderTask = page.render(renderContext);
                    return renderTask.promise.then(() => canvas);
                });
            });
        });
    }

    async function pdfToImage(pdfData, canvas) {
        const scale = 1 / window.devicePixelRatio;
        return (await printPDF(pdfData)).map(async c => {
            canvas.add(
                new fabric.Image(await c, {
                    scaleX: scale,
                    scaleY: scale,
                })
            );
        });
    }

    const canvas = (this.__canvas = new fabric.Canvas('edit'));
    document.querySelector('input').addEventListener('change', async e => {
        text.set('text', 'loading...');
        canvas.requestRenderAll();
        await Promise.all(pdfToImage(e.target.files[0], canvas));
        canvas.remove(text);
    });

    return (
        <div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex flex-col"
                    style={{ zIndex: 9999 }}
                >
                    <div className="p-4 bg-gray-900 grid grid-cols-3 items-center">
                        <div className="flex flex-row ml-64 mt-8 text-white">
                            <IconButton
                                aria-label="delete"
                                className="flex-shrink-0"
                                onClick={handleCloseClick}
                            >
                                <CloseIcon style={{ color: 'white' }} />
                            </IconButton>
                            <div className="ml-8 text-white text-m flex-grow text-left">
                                <FileInfo />
                            </div>
                        </div>
                        <h1 className="ml-4 text-white text-lg flex-grow text-center">TITLE</h1>
                        <div className="flex flex-row justify-end mr-4">
                            <SafeButton
                                text={t('UPLOADER_SAVE')}
                                isMobile={isMobile}
                                licenseCheckRequired={false}
                                onClick={handleSaveClicked}
                            ></SafeButton>
                        </div>
                    </div>
                    <div className="flex-grow flex items-center justify-center bg-white w-full h-full">
                        <canvas id="edit" className="w-full h-full"></canvas>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileEditor;
