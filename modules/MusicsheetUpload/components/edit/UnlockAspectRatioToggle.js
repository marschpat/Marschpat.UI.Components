import React from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import { Checkbox } from '@material-ui/core';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';

const UnlockAspectRatioToggle = props => {
    return (
        <TooltipStyled title="Seitenverhältnis entsperren">
            <Checkbox checked={true} icon={<AspectRatioIcon />} checkedIcon={<AspectRatioIcon />} />
        </TooltipStyled>
    );
};

export default UnlockAspectRatioToggle;
