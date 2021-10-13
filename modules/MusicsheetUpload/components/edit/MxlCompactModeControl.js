import React, { useState } from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';

const MxlCompactModeControl = props => {
    const [compactMode, setCompactMode] = useState(false);
    const toggleCompactMode = () => {
        const value = !compactMode;
        setCompactMode(value);
        props.handleCompactModeChange(value);
    };

    return (
        <div>
            <TooltipStyled title="Kompaktmodus ein/aus: Mit dem Kompaktmodus werden  die Abstände und Skalierung angepasst, um das Notenblatt möglichst auf eine Seite einzupassen">
                <ToggleButton
                    value="system-xml"
                    selected={compactMode}
                    onChange={toggleCompactMode}
                >
                    <ViewCompactIcon />
                </ToggleButton>
            </TooltipStyled>
        </div>
    );
};

export default MxlCompactModeControl;
