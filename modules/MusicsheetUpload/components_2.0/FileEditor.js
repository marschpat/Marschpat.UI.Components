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

const FileEditor = ({
    isOpen,
    originalFile,
    editedCanvasProp,
    onCloseClick,
    onSaveClick,
    selectedVoices,
}) => {
    const [images, setImages] = useState([]);
    const [editedImages, setEditedImages] = useState([]); // NEW: to keep the edited images.
    const [editedCanvas, setEditedCanvas] = useState([]); // NEW: to keep the edited image.
    const [currentIndex, setCurrentIndex] = useState(0); // NEW: to keep track of the currently displayed image index.
    const canvasRef = useRef(null); // NEW: Ref to interact with canvas.
    const containerRef = useRef(null); // NEW: Ref for the canvas container.
    const { isMobile } = useContext(UploaderContext);
    const { t } = useTranslation(['uploader']);
    const [canvas, setCanvas] = useState(null);

    useEffect(() => {
        if (editedCanvasProp != null) setEditedCanvas(editedCanvasProp);
    }, []);

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
    }, [images, currentIndex, canvas, editedCanvas]);

    const handleImageChange = () => {
        if (canvas) {
            if (editedCanvas[currentIndex]) {
                // Deserialization: load from editedCanvas if it exists
                canvas.loadFromJSON(editedCanvas[currentIndex], canvas.renderAll.bind(canvas));
            } else if (images[currentIndex]) {
                // Normal image load if no serialized canvas exists
                fabric.Image.fromURL(
                    images[currentIndex],
                    img => {
                        const scale = Math.min(
                            canvas.width / img.width,
                            canvas.height / img.height
                        );
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
        }
    };

    const handleCloseClick = () => {
        onCloseClick();
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            serializeCanvas();
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            serializeCanvas();
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSaveClicked = () => {
        // Serialize current canvas state before saving
        const newEditedCanvas = [...editedCanvas];
        newEditedCanvas[currentIndex] = canvas.toJSON();

        // TODO implement conversion into png

        console.log('Save Editor clicked');
        onSaveClick(newEditedCanvas);
    };

    const getDisplayVoices = () => {
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
        const maxLength = isMobile ? 16 : 24;

        // If the filename is longer than maxLength, shorten and add ellipsis, preserving extension
        if (fileBaseName.length > maxLength) {
            return `${fileBaseName.slice(0, maxLength)}...${fileExtension}`;
        } else {
            return filename;
        }
    };

    const serializeCanvas = () => {
        if (canvas) {
            const serializedCanvas = canvas.toJSON();
            setEditedCanvas(prevState => {
                const newEditedCanvas = [...prevState];
                newEditedCanvas[currentIndex] = serializedCanvas;
                return newEditedCanvas;
            });
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
                        <div className="absolute right-0 top-0 p-8 mt-8 mr-8 text-black bg-opacity-50 rounded-md bg-gray-300">
                            {currentIndex + 1 + '/' + images?.length}
                        </div>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 text-white bg-black bg-opacity-50 rounded-r-md"
                            style={{
                                zIndex: 1000,
                                visibility: images?.length > 1 ? 'visible' : 'hidden',
                            }} // Ensure button overlays canvas
                        >
                            <NavigateBeforeIcon className="w-36 h-36" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 text-white bg-black bg-opacity-50 rounded-l-md"
                            style={{
                                zIndex: 1000,
                                visibility: images?.length > 1 ? 'visible' : 'hidden',
                            }} // Ensure button overlays canvas
                        >
                            <NavigateNextIcon className="w-36 h-36" />
                        </button>
                        <canvas
                            id="edit"
                            ref={canvasRef}
                            className="absolute top-0 left-0 w-full h-full"
                        ></canvas>
                    </div>
                    {/* Navigation buttons and canvas remain unchanged. */}
                </div>
            )}
        </div>
    );
};

export default FileEditor;
