import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { apiRoutes } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import { useTranslation } from 'react-i18next';

const LoadingError = ({ errorMsg }) => {
    const { t } = useTranslation(['msd']);
    const history = useHistory();
    const { implementationMode } = useContext(MusicsheetLoaderContext);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <CancelOutlinedIcon className="w-76 h-76 text-red-800" />
            <div className="my-20 text-red-800">
                <h6 className="text-2xl font-bold">{t('MSD_ERROR_LOADING_MUSICSHEET')}</h6>
                <p className="text-lg text-center">{errorMsg}</p>
            </div>
            <button onClick={() => history.goBack()} className="text-red-800">
                {t('MSD_ERROR_LOADING_MUSICSHEET_BACK')}
            </button>
            <Link to={apiRoutes[implementationMode].musiclibrary}>
                {t('MSD_ERROR_LOADING_MUSICSHEET_BACKTOML')}
            </Link>
        </div>
    );
};

export default LoadingError;
