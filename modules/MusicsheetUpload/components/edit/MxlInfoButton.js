import React from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useTranslation } from 'react-i18next';

const MxlInfoButton = props => {
    const { t } = useTranslation(['uploader']);
    return (
        <TooltipStyled
            title={
                <>
                    <p>{t('UPLOADER_MXL_INFO_BTN')}</p>
                    <ul className="list-disc list-inside">
                        <li>{t('UPLOADER_MXL_INFO_LINEBREAK')}</li>
                        <li>{t('UPLOADER_MXL_INFO_PAGEBREAK')}</li>
                    </ul>
                    <p className="mt-16">{t('UPLOADER_MXL_INFO_BREAK_DESC')}</p>
                </>
            }
        >
            <IconButton>
                <InfoOutlinedIcon classes={{ root: 'w-28 h-28' }} />
            </IconButton>
        </TooltipStyled>
    );
};

export default MxlInfoButton;
