import React from 'react';
import Button from '@material-ui/core/Button';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

const NextPreviousVoice = props => {

    return (
        <div className="flex justify-end">
            <Button
                onClick={(e) => props.handleNextInstrumentSheet(e, 'previous')}
                variant="contained"
                color="secondary"
                className="text-white mr-10"
                title="Stimme speichern und vorherige Stimme bearbeiten"
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
            >
                <SkipNextIcon />
                <span className="ml-10">Nächste Stimme</span>
            </Button>
        </div>
    );
}

export default NextPreviousVoice;
