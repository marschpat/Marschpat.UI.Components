import React from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import MxlInfoButton from './MxlInfoButton';
import MxlZoomControl from './MxlZoomControl';
import MxlTitleControl from './MxlTitleControl';
import MxlCompactModeControl from './MxlCompactModeControl';
import MxlSkyBottomDistanceControl from './MxlSkyBottomDistanceControl';
import Typography from '@material-ui/core/Typography';

const MxlControlToolbar = props => {
    return (
        <div className="mb-10">
            <div className="flex justify-between items-center">
                <Typography variant="h6" className="text-gray-700 font-semibold">
                    MXL Vorschau
                </Typography>
                <TooltipStyled title="Achtung: Die Anzahl der Seiten ist von der Taktanzahl und Ihren Einstellungen (Skalierung, Notenabstand) abhängig. Fürs Marschieren empfehlen wir die Noten auf eine Seite zu skalieren">
                    <div className="cursor-pointer">
                        {props.pagesCount && (
                            <Typography className="text-gray-500 text-lg font-semibold">
                                Anzahl Seiten: {props.pagesCount}
                            </Typography>
                        )}
                    </div>
                </TooltipStyled>
                <MxlInfoButton />
            </div>
            <div className="mt-20 flex justify-between items-center">
                <div className="flex items-center">
                    <MxlCompactModeControl
                        handleCompactModeChange={props.handleCompactModeChange}
                    />
                    <MxlTitleControl handleShowTitleChange={props.handleShowTitleChange} />
                    <MxlSkyBottomDistanceControl
                        skyBottomDistance={props.osmdOptions?.skyBottomDistance ?? 7}
                        handleSkyBottomDistanceChange={props.handleSkyBottomDistanceChange}
                    />
                </div>
                <div>
                    <MxlZoomControl
                        zoomLevel={props?.osmdOptions?.zoom ?? 1}
                        handleZoom={props.handleZoom}
                    />
                </div>
            </div>
        </div>
    );
};

export default MxlControlToolbar;
