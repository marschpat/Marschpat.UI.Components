import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';

const LayerNameInput = ({ handleLayerNameChange }) => {
    const { t } = useTranslation(['msd']);
    const [name, setName] = useState(t('MSD_NOTES_DEFAULT_NAME'));

    useEffect(() => {
        handleLayerNameChange(name);
    }, [name]);

    return (
        <TextField
            className="mt-12 md:mt-0 md:ml-48"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            onFocus={e => e.target.select()}
            size="small"
        />
    );
};

export default LayerNameInput;
