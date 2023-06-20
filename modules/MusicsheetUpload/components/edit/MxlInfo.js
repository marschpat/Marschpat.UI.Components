import React from 'react';
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';
import { useTranslation } from 'react-i18next';

const MxlInfo = props => {
    const { t } = useTranslation(['uploader']);
    return (
        <div className="mr-20">
            <div className="px-8 py-12 border border-mp-gold rounded-md">
                <div className="flex items-center">
                    <EmojiObjectsOutlinedIcon className="mr-6 text-mp-gold" fontSize="large" />
                    <h3 className="text-gray-700 text-lg">{t('UPLOADER_MXL_INFO')}</h3>
                </div>
                <div className="mt-12">
                    <p className="text-gray-600 text-base">
                        {t('UPLOADER_MXL_INFO_DESC')}
                        <br />
                        {t('UPLOADER_MXL_INFO_DESC_1')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MxlInfo;
