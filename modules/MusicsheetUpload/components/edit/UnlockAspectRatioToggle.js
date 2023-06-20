import React, { useState } from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import { Checkbox } from '@material-ui/core';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import { useTranslation } from 'react-i18next';

const UnlockAspectRatioToggle = props => {
    const { t } = useTranslation(['uploader']);
    const [checked, setChecked] = useState(true);

    function handleChange() {
        setChecked(!checked);
        props.handleAspectRatioLockChange(!checked);
    }
    return (
        <TooltipStyled
            title={checked ? t('UPLOADER_UNLOCK_ASPECT_RATION') : t('UPLOADER_LOCK_ASPECT_RATION')}
        >
            <Checkbox
                checked={checked}
                onChange={handleChange}
                icon={<AspectRatioIcon />}
                checkedIcon={<AspectRatioIcon />}
            />
        </TooltipStyled>
    );
};

export default UnlockAspectRatioToggle;
