import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { MusicsheetDisplayContext } from '../context/MusicsheetDisplayContexts';
import CommentIcon from '@material-ui/icons/Comment';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';

const ToggleSketchpadButton = () => {
    const { t } = useTranslation(['msd']);
    const { viewMode, toggleViewMode } = useContext(MusicsheetDisplayContext);

    return (
        <Button onClick={toggleViewMode} variant="contained" className="md:ml-20 my-4">
            {viewMode === 'sketchpad' ? (
                <div>
                    <CloseIcon />
                    <span className="ml-10">{t('MSD_CLOSE_NOTES')}</span>
                </div>
            ) : (
                <div>
                    <CommentIcon />
                    <span className="ml-10">{t('MSD_CREATE_NOTES')}</span>
                </div>
            )}
        </Button>
    );
};

export default ToggleSketchpadButton;
