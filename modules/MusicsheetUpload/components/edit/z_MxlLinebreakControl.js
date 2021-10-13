import React, { useState } from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import ToggleButton from '@material-ui/lab/ToggleButton';

const MxlLinebreakControl = props => {
    const [linebreaks, setLinebreaks] = useState(false);
    const toggleLinebreaks = () => {
        const value = !linebreaks;
        setLinebreaks(value);
        props.handleLinebreakChange(value);
    };

    return (
        <div className="cursor-not-allowed">
            {/* <TooltipStyled title="Voreingestellte Zeilenumbrüche aus MXL-File übernehmen"> */}
            <ToggleButton
                value="linebreak"
                selected={linebreaks}
                onChange={toggleLinebreaks}
                disabled
            >
                <ClearAllIcon />
            </ToggleButton>
            {/* </TooltipStyled> */}
        </div>
    );
};

export default MxlLinebreakControl;
