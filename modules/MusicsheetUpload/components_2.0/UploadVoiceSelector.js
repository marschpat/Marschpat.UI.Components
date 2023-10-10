import React, { useState, useEffect, useContext } from 'react';
import { UploaderContext } from '../context/UploaderContext';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CollapseButton from '../utils_2.0/CollapseButton';
import VoiceButton from '../utils_2.0/VoiceButton';

const UploadVoiceSelector = ({
    filename,
    instrumentation,
    availableVoices,
    onMetadataEditClick,
    onVoiceClick,
}) => {
    const { t } = useTranslation(['uploader']);
    const { selectedMusicPieceIndex, isMobile, isMetadataVisible } = useContext(UploaderContext);
    const [isExpanded, setIsExpanded] = useState(true);
    const [displayVoices, setDisplayVoices] = useState(false);

    const handleExpandStateChange = newState => {
        setIsExpanded(newState);
    };

    const handleOnVoiceClick = (voice, index) => {
        console.log('handleOnVoiceClick: ', voice, index);
        onVoiceClick(voice, index);
    };

    const getDisplayFilename = () => {
        if (isMobile) {
            if (filename.length > 16) return filename.slice(0, 16) + '...';
            else return filename;
        }

        if (filename.length > 22) return filename.slice(0, 22) + '...';
        else return filename;
    };

    useEffect(() => {
        if (availableVoices && availableVoices.length > 0) {
            const groupedData = availableVoices.reduce((acc, item) => {
                if (!acc[item.group]) {
                    acc[item.group] = [];
                }
                acc[item.group].push(item);
                return acc;
            }, {});
            setDisplayVoices(groupedData);
        } else {
            setDisplayVoices({});
        }
    }, [availableVoices]);

    return (
        <section className="block w-full h-full p-6 mr-6 bg-gray-200  border border-gray-200 shadow pb-24">
            <div
                className={
                    isMobile
                        ? 'relative flex items-center justify-center w-full'
                        : 'relative flex items-center'
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
                <Button
                    variant="contained"
                    className={
                        isMobile
                            ? 'flex justify-between w-full m-24 rounded-md text-white transition-colors bg-blue-600 active:bg-blue-600 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue'
                            : 'group flex justify-between items-center mt-24 rounded-md text-white transition-colors bg-blue-600 active:bg-blue-600 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue'
                    }
                    style={{ textTransform: 'none' }}
                    onClick={() => onMetadataEditClick(selectedMusicPieceIndex)}
                >
                    <div className="flex flex-col items-start justify-start">
                        <div
                            className="text-lg font-light italic text-left"
                            style={{ padding: 0, margin: 0 }}
                        >
                            {getDisplayFilename()}
                        </div>
                        <div
                            className="text-s font-light text-gray-200"
                            style={{ padding: 0, margin: 0 }}
                        >
                            {instrumentation}
                        </div>
                    </div>
                    <EditIcon className="ml-24" style={{ right: 0 }} />
                </Button>
            </div>
            {calcVisible() && (
                <div className="flex flex-col pl-16">
                    {Object.keys(displayVoices).length > 0 &&
                        Object.keys(displayVoices).map(instrument => (
                            <div className="grid grid-cols-1">
                                <p className="text-gray-700 text-lg pt-24 font-semibold">
                                    {instrument}
                                </p>
                                <div className="flex flex-wrap">
                                    {Object.keys(displayVoices[instrument]).length &&
                                        displayVoices[instrument].map(voice => (
                                            <VoiceButton
                                                voice={voice}
                                                onVoiceClick={() =>
                                                    handleOnVoiceClick(
                                                        voice,
                                                        selectedMusicPieceIndex
                                                    )
                                                }
                                            />
                                        ))}
                                </div>
                            </div>
                        ))}
                    {Object.keys(displayVoices).length === 0 && (
                        <div className="flex flex-wrap items-center justify-center pt-64 pb-128 text-center">
                            <div className="flex flex-col items-center justify-center pt-64 p-24 w-full text-gray-700 text-lg mb-4 font-semibold">
                                <div>{t('UPLOADER_SELECTVOICE_TTP')}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );

    function calcVisible() {
        if (!isMobile) return isExpanded;
        else {
            return isExpanded && !isMetadataVisible;
        }
    }
};

export default UploadVoiceSelector;
