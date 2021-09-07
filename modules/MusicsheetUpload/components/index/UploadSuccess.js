import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UploaderContext } from '../../context/UploaderContext';
import { clientRoutes } from '../../utils/ImplementationModesLookup';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const UploadSuccess = props => {
    const { implementationMode } = useContext(UploaderContext);

    return (
        <div className="w-full flex flex-col items-center">
            <Typography className="text-40 text-center" color="primary">
                {!props.hasError
                    ? 'Upload erfolgreich!'
                    : 'Upload fehlgeschlagen'}
            </Typography>
            {!props.hasError ? (
                <>
                    <CheckCircleOutlineIcon
                        fontSize="large"
                        className="w-128 h-128 my-32 text-mp-gold"
                    />
                    <Typography className="text-20 mb-16 text-center">
                        Das Musikstück steht in unserem Notenpool zur Verfügung.
                    </Typography>
                    <div className="mt-16 w-full flex justify-around">
                        <Button
                            component={Link}
                            to={clientRoutes[implementationMode].musiclibrary}
                            variant="contained"
                            color="primary"
                        >
                            Zum Notenpool
                        </Button>
                        <Button
                            onClick={props.handleUploaderReset}
                            variant="contained"
                            color="secondary"
                        >
                            Weiter uploaden
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
                        Beim Upload ist ein Fehler aufgetreten:{' '}
                        <span class="text-red-500">{props.hasError}</span>
                    </Typography>
                    <Button
                        onClick={props.handleSubmitPayloadReset}
                        variant="contained"
                    >
                        Zurück
                    </Button>
                </>
            )}
        </div>
    );
};

export default UploadSuccess;
