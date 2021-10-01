import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';

const LayerNameInput = ({ handleLayerNameChange }) => {
    const [name, setName] = useState('Neue Notiz');

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
