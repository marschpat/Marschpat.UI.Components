import React from 'react';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const LinearProgressWithLabel = props => {
    return (
        <div className="w-full flex items-center justify-center">
            <LinearProgress variant="determinate" value={props.value} color="secondary" className="max-w-sm w-full" />
            <Typography className="ml-10 flex-shrink-0">{props.value ?? '0'} %</Typography>
        </div>
    );
};

export default LinearProgressWithLabel;
