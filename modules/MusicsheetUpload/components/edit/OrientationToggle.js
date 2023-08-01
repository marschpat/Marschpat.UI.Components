import React from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import CropPortraitIcon from '@material-ui/icons/CropPortrait';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useTranslation } from 'react-i18next';

const OrientationToggle = props => {
    const { t } = useTranslation(['uploader']);
    const toggleOrientation = (e, value) => {
        if (!value) return;
        props.handleOrientationChange(value);
    };

    return (
        <ToggleButtonGroup
            value={props.orientation}
            exclusive
            onChange={toggleOrientation}
            aria-label={t('UPLOADER_ORIENTATION_TOGGLE')}
        >
            <ToggleButton value="landscape" aria-label={t('UPLOADER_ORIENTATION_LANDSCAPE')}>
                <TooltipStyled title={t('UPLOADER_ORIENTATION_LANDSCAPE_1')}>
                    <CropLandscapeIcon />
                </TooltipStyled>
            </ToggleButton>
            <ToggleButton value="portrait" aria-label={t('UPLOADER_ORIENTATION_PORTRAIT')}>
                <TooltipStyled title={t('UPLOADER_ORIENTATION_PORTRAIT_1')}>
                    <CropPortraitIcon />
                </TooltipStyled>
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default OrientationToggle;
