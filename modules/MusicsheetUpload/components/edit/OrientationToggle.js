import React from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import CropPortraitIcon from '@material-ui/icons/CropPortrait';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const OrientationToggle = props => {
    const toggleOrientation = (e, value) => {
        if (!value) return;
        props.handleOrientationChange(value);
    }

    return (
        <ToggleButtonGroup
            value={props.orientation}
            exclusive
            onChange={toggleOrientation}
            aria-label="Orientierung - Quer / Hochformat"
        >
                <ToggleButton value="landscape" aria-label="Querformat - Landscape">
                    <TooltipStyled title="Querformat">
                        <CropLandscapeIcon />
                    </TooltipStyled>
                </ToggleButton>
                <ToggleButton value="portrait" aria-label="Hochformat - Portrait">
                    <TooltipStyled title="Hochformat">
                        <CropPortraitIcon />
                    </TooltipStyled>
                </ToggleButton>
        </ToggleButtonGroup>
    );
}

export default OrientationToggle;
