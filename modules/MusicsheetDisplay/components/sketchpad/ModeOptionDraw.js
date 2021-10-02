import React from 'react';

const ModeOptionDraw = props => {
    return (
        <div className="flex items-center">
            <input
                type="color"
                value={props.drawOptions.color}
                onChange={props.handleDrawColorChange}
                className="w-64 block border shadow-sm rounded-md"
            />
            <input
                type="number"
                value={props.drawOptions.size}
                onChange={props.handleDrawSizeChange}
                min="0"
                max="66"
                className="ml-24 w-64 block border shadow-sm rounded-md"
            />
        </div>
    );
};

export default ModeOptionDraw;
