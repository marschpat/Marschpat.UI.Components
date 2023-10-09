import React, { useState, useEffect, useContext, useRef } from 'react';
import { loadPdf, renderPageAsImage } from '../utils/PdfViewerHelpers';
import { UploaderContext } from '../context/UploaderContext';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'; // Import left arrow icon
import NavigateNextIcon from '@material-ui/icons/NavigateNext'; // Import right arrow icon
import SafeButton from '../utils_2.0/SafeButton';
import EditorToolbar from './EditorToolbar';
import { fabric } from 'fabric';

const FileEditor = ({ isOpen, originalFile, onCloseClick, metaData, selectedVoices }) => {
    const [images, setImages] = useState([]);
    const [editedImages, setEditedImages] = useState([]); // NEW: to keep the edited images.
    const [currentIndex, setCurrentIndex] = useState(0); // NEW: to keep track of the currently displayed image index.
    const canvasRef = useRef(null); // NEW: Ref to interact with canvas.
    const containerRef = useRef(null); // NEW: Ref for the canvas container.
    const { isMobile } = useContext(UploaderContext);
    const { t } = useTranslation(['uploader']);
    const [canvas, setCanvas] = useState(null);

    useEffect(() => {
        if (canvasRef.current && containerRef.current) {
            const updateCanvasSize = () => {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
            };
            updateCanvasSize();
            setCanvas(new fabric.Canvas(canvasRef.current));
            window.addEventListener('resize', updateCanvasSize);
            return () => window.removeEventListener('resize', updateCanvasSize);
        }
    }, [containerRef, canvasRef]);

    useEffect(() => {
        if (originalFile.type === 'image') {
            setImages([originalFile.data]);
        } else if (originalFile.type === 'pdf') {
            loadPdf(originalFile.data).then(pdf => {
                const newImages = [];
                for (let i = 1; i <= pdf._pdfInfo.numPages; i++) {
                    renderPageAsImage(pdf, i).then(img => {
                        newImages.push(img);
                        setImages(prevImages => [...prevImages, img]);
                    });
                }
            });
        }
    }, [originalFile]);

    useEffect(() => {
        handleImageChange();
    }, [images, currentIndex, canvas]);

    const handleImageChange = () => {
        if (canvas && images[currentIndex]) {
            fabric.Image.fromURL(
                images[currentIndex],
                img => {
                    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                    img.set({
                        scaleX: scale,
                        scaleY: scale,
                        left: (canvas.width - img.width * scale) / 2,
                        top: (canvas.height - img.height * scale) / 2,
                        selectable: false,
                    });
                    canvas.clear();
                    canvas.add(img);
                    canvas.renderAll();
                },
                { crossOrigin: 'anonymous' }
            );
        }
    };

    const handleCloseClick = () => {
        onCloseClick();
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(prev => {
                const newIndex = prev + 1;
                return newIndex;
            });
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => {
                const newIndex = prev - 1;
                return newIndex;
            });
        }
    };

    const handleSaveClicked = () => {
        // UPDATED: Save the canvas state before closing.
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            setEditedImages(prev => [...prev, canvas.toJSON()]);
        }
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
                        <h1 className="ml-4 text-white text-lg flex-grow text-center">
                            <EditorToolbar canvas={canvas} />
                        </h1>
                        <div className="flex flex-row justify-end mr-4">
                            <SafeButton
                                text={t('UPLOADER_SAVE')}
                                isMobile={isMobile}
                                licenseCheckRequired={false}
                                onClick={handleSaveClicked}
                            ></SafeButton>
                        </div>
                    </div>
                    <div
                        ref={containerRef}
                        className="flex-grow flex items-center justify-center bg-white w-full h-full relative"
                    >
                        {/* Navigation buttons and canvas remain unchanged. */}
                        <button
                            onClick={handlePrevious}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 text-white bg-black bg-opacity-50 rounded-r-md"
                            style={{ zIndex: 1000 }} // Ensure button overlays canvas
                        >
                            <NavigateBeforeIcon />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 text-white bg-black bg-opacity-50 rounded-l-md"
                            style={{ zIndex: 1000 }} // Ensure button overlays canvas
                        >
                            <NavigateNextIcon />
                        </button>
                        <canvas
                            id="edit"
                            ref={canvasRef}
                            className="absolute top-0 left-0 w-full h-full"
                        ></canvas>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileEditor;
