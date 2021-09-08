import React, { useState, useEffect } from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import IconButton from '@material-ui/core/IconButton';

const MxlZoomControl = props => {
    const [zoom, setZoom] = useState(1);
    const zoomIn = () => setZoom(zoom => roundDecimals(zoom + 0.05));
    const zoomOut = () => setZoom(zoom => roundDecimals(zoom - 0.05));

    useEffect(() => {
        setZoom(props.zoomLevel);
    }, [props.zoomLevel]);

    useEffect(() => {
        props.handleZoom(zoom);
    }, [zoom]);

    return (
        <div className="flex items-center">
            <TooltipStyled title="Größenskalierung der Noten einstellen: Zoom In">
                <IconButton onClick={zoomIn}>
                    <ZoomInIcon classes={{ root: 'w-40 h-40' }} />
                </IconButton>
            </TooltipStyled>
            <h3 className="text-gray-500 text-lg font-semibold">{Math.round(zoom * 100)} %</h3>
            <TooltipStyled title="Größenskalierung der Noten einstellen: Zoom Out">
                <IconButton onClick={zoomOut}>
                    <ZoomOutIcon classes={{ root: 'w-40 h-40' }} />
                </IconButton>
            </TooltipStyled>
        </div>
    );
};

function roundDecimals(number) {
    return Math.round(number * 100) / 100;
}

export default MxlZoomControl;
