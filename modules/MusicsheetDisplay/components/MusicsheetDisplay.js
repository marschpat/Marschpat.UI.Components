import React, { useEffect, useState } from 'react';
import Sketchpad from './sketchpad/Sketchpad';
import FullscreenHeader from './FullscreenHeader';
import MusicsheetPageImageCarousel from './MusicsheetPageImageCarousel';
import { MusicsheetDisplayContext } from '../context/MusicsheetDisplayContexts';

const MusicsheetDisplay = props => {
    const [viewMode, setViewMode] = useState('view');
    const [showPagesPreview, setShowPagesPreview] = useState(true);
    const [isCarouselFullscreen, setIsCarouselFullscreen] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        if (modeParam === 'sketchpad') {
            setViewMode('sketchpad');
        }
    }, []);

    function toggleViewMode() {
        setViewMode(prev => (prev === 'view' ? 'sketchpad' : 'view'));
    }

    return (
        <MusicsheetDisplayContext.Provider
            value={{
                closeDialog: props.handleClose,
                viewMode,
                toggleViewMode,
                isCarouselFullscreen,
                setIsCarouselFullscreen,
                showPagesPreview,
                setShowPagesPreview,
            }}
        >
            <FullscreenHeader />

            <div className="mt-48 w-full">
                {/* render "normal" VIEW view mode */}
                {viewMode === 'view' && <MusicsheetPageImageCarousel />}

                {/* render SKETCHPAD view mode */}
                {viewMode === 'sketchpad' && <Sketchpad />}
            </div>
        </MusicsheetDisplayContext.Provider>
    );
};

export default MusicsheetDisplay;
