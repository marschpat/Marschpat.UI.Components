import React from 'react';
import useDispatchConfirmDialog from '@marschpat/local/utils/useDispatchConfirmDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';

const DeleteInstrumentSheetButton = props => {
    const { t } = useTranslation(['uploader']);
    const dispatchConfirm = useDispatchConfirmDialog();

    const removeInstrumentSheet = () => {
        props.handleRemoveInstrumentSheets([props.sheetId]);
    };

    const handleClick = () => {
        dispatchConfirm(
            removeInstrumentSheet,
            t('UPLOADER_VOICE_REMOVE'),
            t('UPLOADER_VOICE_REMOVE_DESC')
        );
    };

    return (
        <IconButton
            onClick={handleClick}
            aria-label="remove-instrument-voice"
            title={t('UPLOADER_VOICE_REMOVE_ACTION')}
        >
            <DeleteIcon />
        </IconButton>
    );
};

export default DeleteInstrumentSheetButton;
