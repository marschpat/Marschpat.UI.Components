import React from 'react';
import Button from '@material-ui/core/Button';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import { useTranslation } from 'react-i18next';

const NextPreviousVoice = props => {
    const { t } = useTranslation(['uploader']);
    return (
        <div className="flex justify-end">
            <Button
                onClick={e => props.handleNextInstrumentSheet(e, 'previous')}
                variant="contained"
                color="secondary"
                className="text-white mr-10"
                title={t('UPLOADER_PREV_VOICE_AND_SAVE')}
            >
                <SkipPreviousIcon />
                <span className="ml-10">{t('UPLOADER_PREV_VOICE')}</span>
            </Button>
            <Button
                onClick={props.handleNextInstrumentSheet}
                variant="contained"
                color="secondary"
                className="text-white ml-10"
                title={t('UPLOADER_NEXT_VOICE_AND_SAVE')}
            >
                <SkipNextIcon />
                <span className="ml-10">{t('UPLOADER_NEXT_VOICE')}</span>
            </Button>
        </div>
    );
};

export default NextPreviousVoice;
