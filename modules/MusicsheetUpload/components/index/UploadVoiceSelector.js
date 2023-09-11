import React, { useState, useEffect, useContext, useRef } from 'react';
import EmbedVideo from './EmbedVideo';
import BrowserSupportNote from './BrowserSupportNote'; 
import { UploaderContext } from '../../context/UploaderContext';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import CloseButton from '../../utils/CloseButton';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CollapseButton from '../../utils/CollapseButton';

const UploadVoiceSelector = ({filename, instrumentation, onMetadataEditClick}) => {
    const { t } = useTranslation(['uploader']);
    const { implementationMode } = useContext(UploaderContext);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleExpandStateChange = (newState) => {
        setIsExpanded(newState);
    };

    return (
        <section className="block w-full p-6 mr-6 bg-gray-200  border border-gray-200 shadow pb-24">
            <div className="relative flex items-start">
            <div className="App flex space-x-4 mt-36">
                <CollapseButton
                    isExpanded={isExpanded} 
                    onStateChange={handleExpandStateChange}
                />
            </div>
            <Button
                variant="contained"
                endIcon={<EditIcon className='ml-24'/>}
                className="flex items-center bg-blue-600 mt-24 rounded-md text-white"
                style={{ textTransform: 'none' }}
                onClick={onMetadataEditClick}
            >
                <div className="flex flex-col items-start">
                    <span className="text-sm not-uppercase">{filename}</span>
                    <span className="text-s not-uppercase">{instrumentation}</span>
                </div>
            </Button>
            <div className="flex space-x-4">
                <BrowserSupportNote />
                <EmbedVideo />
            </div>
            </div>
            <div className="flex flex-wrap pl-24">
            </div>
        </section>
    );
};

export default UploadVoiceSelector;
