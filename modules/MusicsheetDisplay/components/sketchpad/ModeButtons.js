import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import GestureIcon from '@material-ui/icons/Gesture';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import BorderColorIcon from '@material-ui/icons/BorderColor';

const ModeButtons = props => {
    return (
        <div>
            <ToggleButtonGroup
                value={props.mode}
                exclusive
                onChange={props.handleModeChange}
                aria-label="text alignment"
            >
                <ToggleButton value="draw" aria-label="frei zeichnen" title="zeichnen">
                    <GestureIcon />
                </ToggleButton>
                <ToggleButton value="marker" aria-label="highlight something" title="Textmarker">
                    <BorderColorIcon />
                </ToggleButton>
                <ToggleButton value="text" aria-label="text" title="text" disabled>
                    <TextFieldsIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

export default ModeButtons;
