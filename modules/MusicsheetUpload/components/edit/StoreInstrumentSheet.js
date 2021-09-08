import React from 'react';
import NextPreviousVoice from './NextPreviousVoice';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';

const StoreInstrumentSheet = props => {
    return (
        <section className="mt-40 py-24 flex justify-end">
            <NextPreviousVoice handleNextInstrumentSheet={props.handleNextInstrumentSheet} />
            <div className="ml-48 inline-block" title="Stimme speichern und Editor schließen">
                <Button onClick={props.handleStoreInstrumentSheet} variant="contained" color="secondary">
                    <div className="flex items-center">
                        <DoneIcon className="text-white" />
                        <span className="ml-12 text-white text-xl font-bold">Stimme speichern</span>
                    </div>
                </Button>
            </div>
        </section>
    );
};

export default StoreInstrumentSheet;
