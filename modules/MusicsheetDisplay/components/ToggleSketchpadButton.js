import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { MusicsheetDisplayContext } from '../context/MusicsheetDisplayContexts';
import CommentIcon from '@material-ui/icons/Comment';
import CloseIcon from '@material-ui/icons/Close';

const ToggleSketchpadButton = () => {
    const { viewMode, toggleViewMode } = useContext(MusicsheetDisplayContext);

    return (
        <Button onClick={toggleViewMode} variant="contained" className="md:ml-20 my-4">
            {viewMode === 'sketchpad' ? (
                <div>
                    <CloseIcon />
                    <span className="ml-10">Notizen schließen</span>
                </div>
            ) : (
                <div>
                    <CommentIcon />
                    <span className="ml-10">Notizen anlegen</span>
                </div>
            )}
        </Button>
    );
};

export default ToggleSketchpadButton;
