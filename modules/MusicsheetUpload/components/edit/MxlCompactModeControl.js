import React, { useState } from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import { useTranslation } from 'react-i18next';

const MxlCompactModeControl = props => {
    const { t } = useTranslation(['uploader']);
    const [compactMode, setCompactMode] = useState(false);
    const toggleCompactMode = () => {
        const value = !compactMode;
        setCompactMode(value);
        props.handleCompactModeChange(value);
    };

    return (
        <div>
            <TooltipStyled title={t('UPLOADER_MXL_COMPACTMODE')}>
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
