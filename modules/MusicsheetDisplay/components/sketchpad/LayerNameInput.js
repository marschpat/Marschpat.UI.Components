import React, { useContext, useEffect, useState } from 'react';
import { SketchpadLayerContext } from '../../context/SketchpadContexts';
import TextField from '@material-ui/core/TextField';

const LayerNameInput = () => {
    const { setLayerInCreationName } = useContext(SketchpadLayerContext);
    const [name, setName] = useState('Neue Notiz');

    useEffect(() => {
        setLayerInCreationName(name);
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
