import React from 'react';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import Typography from '@material-ui/core/Typography';

const ProgressInfo = props => {
    const bytesToMb = sizeInBytes => (sizeInBytes / (1024*1024)).toFixed(2);
    const progressDescription = props.description ?? 'Upload gesamt';

    return (
        <div>
            <Typography className="text-24 mb-16 text-center">
                {props.message}
            </Typography>
            <div className="pt-32 flex justify-center">
                <LinearProgressWithLabel value={props.progress} />
            </div>
            <div className="mt-32 flex justify-center">
                <Typography className="text-xl">{progressDescription}: {bytesToMb(props.totalSize)} Mb</Typography>
            </div>
            {props.infoText && (<div className="max-w-sm mt-40">
                <Typography color="textSecondary" className="text-base" >{props.infoText}</Typography>
            </div>)}
        </div>
    );
}

export default ProgressInfo;
