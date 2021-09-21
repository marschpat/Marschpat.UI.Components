import React, { useEffect, useState } from 'react';
import ModeOptionDraw from './ModeOptionDraw';

const ModeOptions = props => {
    const [modeOptions, setModeOptions] = useState({
        draw: { name: 'draw', size: 5, color: '#3f3f3f' },
        marker: { name: 'marker', size: 24, color: '#dcff00', opacity: 0.1 },
        text: { name: 'text' },
        line: { name: 'line' },
    });

    useEffect(() => {
        props.handleModeOptionsChanged(modeOptions);
    }, [props.mode, modeOptions]);

    function handleDrawSizeChange(e, v) {
        setModeOptions(prev => ({
            ...prev,
            draw: { ...prev.draw, size: Number(e.target.value) },
        }));
    }

    function handleDrawColorChange(e, v) {
        setModeOptions(prev => ({
            ...prev,
            draw: { ...prev.draw, color: e.target.value },
        }));
    }

    return (
        <div className="ml-24">
            {props.mode === 'draw' && (
                <ModeOptionDraw
                    drawOptions={modeOptions[props.mode]}
                    handleDrawSizeChange={handleDrawSizeChange}
                    handleDrawColorChange={handleDrawColorChange}
                />
            )}
            {props.mode === 'marker' && <p>Textmarker / Highlighter</p>}
            {props.mode === 'text' && <p>Text als Notiz</p>}
        </div>
    );
};

export default ModeOptions;
