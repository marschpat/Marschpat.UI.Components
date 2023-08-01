import React from 'react';
import NextPreviousVoice from './NextPreviousVoice';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import { useTranslation } from 'react-i18next';

const StoreInstrumentSheet = props => {
    const { t } = useTranslation(['uploader']);
    return (
        <section className="mt-40 py-24 flex justify-end">
            <NextPreviousVoice handleNextInstrumentSheet={props.handleNextInstrumentSheet} />
            <div className="ml-48 inline-block" title={t('UPLOADER_SAVE_VOICE_AND_CLOSE')}>
                <Button
                    onClick={props.handleStoreInstrumentSheet}
                    variant="contained"
                    color="secondary"
                >
                    <div className="flex items-center">
                        <DoneIcon className="text-white" />
                        <span className="ml-12 text-white text-xl font-bold">
                            {t('UPLOADER_SAVE_VOICE')}
                        </span>
                    </div>
                </Button>
            </div>
        </section>
    );
};

export default StoreInstrumentSheet;
