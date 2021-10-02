import React, { useState } from 'react';
import UndoDraw from './UndoDraw';
import ModeButtons from './ModeButtons';
import ModeOptions from './ModeOptions';

const PageLayerModeControl = props => {
    const availableModes = ['draw', 'marker', 'text'];
    const [mode, setMode] = useState('draw');

    function handleModeChange(e, value) {
        if (!availableModes.includes(value)) return;
        setMode(value);
    }

    function handleModeOptionsChanged(modeOptions) {
        const layerOptions = modeOptions[mode];
        props.handleLayerOptionsChange(layerOptions);
    }

    return (
        <div className="mb-4 flex items-center justify-between">
            <div className="flex-1 flex items-center">
                <ModeButtons mode={mode} handleModeChange={handleModeChange} />
                <ModeOptions mode={mode} handleModeOptionsChanged={handleModeOptionsChanged} />
                <UndoDraw />
            </div>
        </div>
    );
};

export default PageLayerModeControl;
