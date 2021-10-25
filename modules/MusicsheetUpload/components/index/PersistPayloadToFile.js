import React, { useContext } from 'react';
import { UploaderContext } from '../../context/UploaderContext';
import MusicsheetUploadApiAdapter from '../../utils/MusicsheetUploadApiAdapter';
import Button from '@material-ui/core/Button';

const PersistPayloadToFile = props => {
    const { implementationMode } = useContext(UploaderContext);
    const downloadJsonPayload = () => {
        const apiAdapter = new MusicsheetUploadApiAdapter(
            props.finalPayload,
            implementationMode,
            true
        );
        const payload = {
            ...props.finalPayload,
            instrumentSheets: apiAdapter.getCleanInstrumentSheets(),
        };
        const data = 'data:text/json;charset=utf-8,' + JSON.stringify(payload);
        const dl = document.createElement('a');
        dl.download = 'payload.json';
        dl.href = data;
        dl.click();
    };

    return (
        <div className="mt-12 flex justify-end">
            <Button onClick={downloadJsonPayload} variant="contained" color="primary">
                Persist payload to file
            </Button>
        </div>
    );
};

export default PersistPayloadToFile;
