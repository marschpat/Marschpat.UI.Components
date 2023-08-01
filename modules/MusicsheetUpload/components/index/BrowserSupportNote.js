import React, { useContext } from 'react';
import InfoTooltip from '../InfoTooltip';
import { UploaderContext } from '../../context/UploaderContext';
import { useTranslation } from 'react-i18next';

function BrowserSupportNote(props) {
    const { inHelpMode } = useContext(UploaderContext);
    const { t } = useTranslation(['uploader']);

    return (
        inHelpMode && (
            <div className="flex items-center">
                <p className="mr-10 text-base text-orange-300 font-bold">
                    {t('UPLOADER_WHICHBROWSER')}
                </p>
                <InfoTooltip name="browser-info" title={t('UPLOADER_WHICHBROWSER_DESC')} />
            </div>
        )
    );
}

export default BrowserSupportNote;
