import React, { useEffect, useState } from 'react';
import ModeOptionDraw from './ModeOptionDraw';
import Typography from '@material-ui/core/Typography';

const ModeOptions = props => {
    const [modeOptions, setModeOptions] = useState({
        draw: { name: 'draw', size: 5, color: '#3f3f3f' },
        marker: { name: 'marker', size: 32, color: 'rgba(234, 255, 0, 0.43)' },
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
            {props.mode === 'marker' && <Typography className="text-gray-700">Textmarker / Highlighter</Typography>}
            {props.mode === 'text' && <Typography className="text-gray-700">Text als Notiz</Typography>}
        </div>
    );
};

export default ModeOptions;
