import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

const NextPreviousVoice = props => {
    const [disabled, setDisabled] = useState({ next: false, prev: false });
    const buttonEl = useRef(null);

    return (
        <div className="flex justify-end">
            <Button
                onClick={e => {
                    setTimeout(() => {
                        buttonEl.current.setAttribute('disabled', 'disabled');
                        setDisabled({ ...disabled, prev: true });
                        props.handleNextInstrumentSheet(e, 'previous');
                    }, 250);
                }}
                variant="contained"
                color="secondary"
                className="text-white mr-10"
                title="Stimme speichern und vorherige Stimme bearbeiten"
                disabled={disabled.prev}
                ref={buttonEl}
            >
                <SkipPreviousIcon />
                <span className="ml-10">Vorherige Stimme</span>
            </Button>
            <Button
                onClick={props.handleNextInstrumentSheet}
                variant="contained"
                color="secondary"
                className="text-white ml-10"
                title="Stimme speichern und nächste Stimme bearbeiten"
                disabled={!props.isReady}
            >
                <SkipNextIcon />
                <span className="ml-10">Nächste Stimme</span>
            </Button>
        </div>
    );
};

export default NextPreviousVoice;
