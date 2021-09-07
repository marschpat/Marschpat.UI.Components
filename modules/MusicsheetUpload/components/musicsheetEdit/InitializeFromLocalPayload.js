import React, { useState, useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';

const InitializeFromLocalPayload = props => {
    const inputEl = useRef(null);
    const [logMsg, setLogMsg] = useState('');
    const [rawInitialData, setRawInitialData] = useState(null);

    useEffect(() => {
        if (rawInitialData) {
            setLogMsg(prev => (prev += 'Try to initialize payload \n'));
            console.log('paylaod', rawInitialData);
            try {
                props.handleMusicsheetEditData(rawInitialData);
            } catch (error) {
                console.error(error);
                setLogMsg(
                    prev =>
                        (prev +=
                            "Seems something's not right with the payload. Check errors in dev console. \n")
                );
            }
        }
    }, [rawInitialData]);

    const initializeFromFile = file => {
        const reader = new FileReader();
        setLogMsg(`Initializing from file: ${file.name} \n`);

        reader.onload = event => {
            const rawData = JSON.parse(event.target.result);
            setRawInitialData(rawData);
        };
        reader.readAsText(file);
    };

    const handleClick = () => {
        const file = inputEl.current.files[0];
        if (!file || file.type !== 'application/json') {
            setLogMsg('No valid JSON payload selected');
            return;
        }

        initializeFromFile(file);
    };

    return (
        <div className="mx-20 py-20">
            <h2 className="mb-10">Initialize Uploader from local payload</h2>
            <div className="flex">
                <input type="file" ref={inputEl} />
                <Button
                    onClick={handleClick}
                    color="primary"
                    variant="contained"
                    className="ml-40"
                >
                    Initialize
                </Button>
            </div>
            <div className="mt-20">
                <h3>Log:</h3>
                <p className="whitespace-pre-line">{logMsg}</p>
            </div>
        </div>
    );
};

export default InitializeFromLocalPayload;
