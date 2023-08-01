import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import { useTranslation } from 'react-i18next';

const InstrumentVoiceInfo = ({ voice }) => {
    const { t } = useTranslation(['msd']);
    const { instrumentVoice } = useContext(MusicsheetLoaderContext);

    return (
        <Typography className="ml-20">
            {t('MSD_VOICE')}: {instrumentVoice.name}
        </Typography>
    );
};

export default InstrumentVoiceInfo;
