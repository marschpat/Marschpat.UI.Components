import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const LoadingBusyIndicator = props => {

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center">
                <CircularProgress color="primary" />
            </div>
            <Typography className="mt-24 text-lg">{props.msg}</Typography>
            {props.description ? (
                <div className="max-w-lg">
                    <Typography className="mt-12 text-gray-700">{props.description}</Typography>
                </div>
            ) : <></>}
        </div>
    )
}

export default LoadingBusyIndicator;
