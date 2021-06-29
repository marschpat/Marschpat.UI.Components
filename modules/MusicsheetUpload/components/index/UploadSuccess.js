import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const UploadSuccess = props => {
    return (
        <div className="w-full flex flex-col items-center">
            <Typography className="text-40 text-center" color="primary">
                Upload erfolgreich!
            </Typography>
            <CheckCircleOutlineIcon fontSize="large" className="w-128 h-128 my-32 text-mp-gold" />
            <Typography className="text-20 mb-16 text-center">
                Das Musikstück steht in unserem Notenpool zur Verfügung.
            </Typography>
            <div className="mt-16 w-full flex justify-around">
                <Button
                    component={Link}
                    to="/musiclibrary"
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
        </div>
    );
}

export default UploadSuccess;
