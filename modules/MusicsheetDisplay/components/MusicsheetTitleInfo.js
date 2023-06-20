import React, { useContext } from 'react';
import MusicsheetInfoPopover from '@marschpat/Marschpat.UI.Components/components/MusicsheetInfoPopover';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

const MusicsheetTitleInfo = () => {
    const { t } = useTranslation(['msd']);
    const { musicsheetMetaData } = useContext(MusicsheetLoaderContext);

    return (
        <div className="flex items-center">
            <Typography variant="h6" noWrap>
                {t('MSD_PIECE')}: {musicsheetMetaData.name}
            </Typography>

            <MusicsheetInfoPopover
                musicsheet={musicsheetMetaData}
                btnColor="inherit"
                className="ml-20"
            />
        </div>
    );
};

export default MusicsheetTitleInfo;
