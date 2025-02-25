import React, { useState } from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import TitleIcon from '@material-ui/icons/Title';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { useTranslation } from 'react-i18next';

const MxlTitleControl = props => {
    const { t } = useTranslation(['uploader']);
    const [showTitle, setShowTitle] = useState(false);
    const toggleShowTitle = () => {
        const value = !showTitle;
        setShowTitle(value);
        props.handleShowTitleChange(value);
    };

    return (
        <div className="ml-20">
            <TooltipStyled title={t('UPLOADER_MXL_SHOW_TITLE_AND_SUB')}>
                <ToggleButton value="mxl-title" selected={showTitle} onChange={toggleShowTitle}>
                    <TitleIcon />
                </ToggleButton>
            </TooltipStyled>
        </div>
    );
};

export default MxlTitleControl;
