import React, { useState } from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import { Checkbox } from '@material-ui/core';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';

const UnlockAspectRatioToggle = props => {
    const [checked, setChecked] = useState(true);
    return (
        <TooltipStyled title={checked ? 'Seitenverhältnis entsperren' : 'Seitenverhältnis sperren'}>
            <Checkbox
                checked={checked}
                onChange={() => setChecked(prev => !prev)}
                icon={<AspectRatioIcon />}
                checkedIcon={<AspectRatioIcon />}
            />
        </TooltipStyled>
    );
};

export default UnlockAspectRatioToggle;
