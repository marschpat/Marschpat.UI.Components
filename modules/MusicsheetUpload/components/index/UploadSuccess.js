import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UploaderContext } from '../../context/UploaderContext';
import { apiRoutes } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useTranslation } from 'react-i18next';

const UploadSuccess = props => {
    const { t } = useTranslation(['uploader']);
    const { implementationMode } = useContext(UploaderContext);

    return (
        <div className="w-full flex flex-col items-center">
            <Typography className="text-40 text-center" color="primary">
                {!props.hasError ? `${t('UPLOADER_UPLOAD_SUCCESS')}!` : t('UPLOADER_UPLOAD_ERROR')}
            </Typography>
            {!props.hasError ? (
                <>
                    <CheckCircleOutlineIcon
                        fontSize="large"
                        className="w-128 h-128 my-32 text-mp-gold"
                    />
                    <Typography className="text-20 mb-16 text-center">
                        {t('UPLOADER_UPLOAD_SUCCESS_DESC')}
                    </Typography>
                    <div className="mt-16 w-full flex justify-around">
                        <Button
                            component={Link}
                            to={apiRoutes[implementationMode].musiclibrary}
                            variant="contained"
                            color="primary"
                        >
                            {t('UPLOADER_UPLOAD_SUCCESS_GOTO_MUSICLIB')}
                        </Button>
                        <Button
                            onClick={() => window.location.reload(false)}
                            variant="contained"
                            color="secondary"
                        >
                            {t('UPLOADER_UPLOAD_SUCCESS_GOTO_UPLOAD')}
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <CancelOutlinedIcon
                        fontSize="large"
                        className="w-128 h-128 my-32 text-red-500"
                    />
                    <Typography className="text-20 mb-16 text-center">
                        {t('UPLOADER_UPLOAD_ERROR_MSG')}{' '}
                        <span className="text-red-500">{props.hasError}</span>
                    </Typography>
                    <Button onClick={props.handleSubmitPayloadReset} variant="contained">
                        {t('UPLOADER_UPLOAD_ERROR_BACK')}
                    </Button>
                </>
            )}
        </div>
    );
};

export default UploadSuccess;
