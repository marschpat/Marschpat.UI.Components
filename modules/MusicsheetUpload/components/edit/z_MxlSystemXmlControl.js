import React, { useState } from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import ToggleButton from '@material-ui/lab/ToggleButton';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';

const MxlSystemXmlControl = props => {
    const [systemXml, setSystemXml] = useState(false);
    const toggleSystemXml = () => {
        const value = !systemXml;
        setSystemXml(value);
        props.handleSystemChange(value);
    }

    return (
        <div className="ml-16 cursor-not-allowed">
            {/* <TooltipStyled title="Voreingestellte Seitenumbrüche aus MXL-File übernehmen"> */}
                <ToggleButton
                    value="system-xml"
                    selected={systemXml}
                    onChange={toggleSystemXml}
                    disabled
                    className="cursor-not-allowed"
                >
                    <SettingsInputComponentIcon />
                </ToggleButton>
            {/* </TooltipStyled> */}
        </div>
    );
}

export default MxlSystemXmlControl;
