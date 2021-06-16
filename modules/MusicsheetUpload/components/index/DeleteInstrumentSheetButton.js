import React from 'react';
import useDispatchConfirmDialog from '@marschpat/local/utils/useDispatchConfirmDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const DeleteInstrumentSheetButton = props => {
    const dispatchConfirm = useDispatchConfirmDialog();

    const removeInstrumentSheet = () => {
        props.handleRemoveInstrumentSheets([props.sheetId]);
    }

    const handleClick = () => {
        dispatchConfirm(
            removeInstrumentSheet,
            'Stimme wirklich entfernen?',
            'Stimme wirklich entfernen? Alle Änderungen gehen verloren.',
        );
    }

    return (
        <IconButton
            onClick={handleClick}
            aria-label="remove-instrument-voice"
            title="Stimme löschen"
        >
            <DeleteIcon />
        </IconButton>
    );
}

export default DeleteInstrumentSheetButton;
