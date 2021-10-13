import React, { useContext, useEffect, useState } from 'react';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import { MusicsheetDisplayContext } from '../../context/MusicsheetDisplayContexts';

const LayersSelect = () => {
    const { sketchpadLayers, setSketchpadLayers } = useContext(MusicsheetDisplayContext);
    const [values, setValues] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (sketchpadLayers.length > 0) {
            setOptions(
                sketchpadLayers.map(layer => {
                    return { label: layer.name, value: layer.uuid };
                })
            );
            setValues(
                sketchpadLayers
                    .filter(l => l.active)
                    .map(layer => ({ label: layer.name, value: layer.uuid }))
            );
        }
    }, [sketchpadLayers]);

    function handleActiveLayersChange(selected) {
        const updatedLayers = sketchpadLayers.map(layer => {
            return selected.map(i => i.value).includes(layer.uuid)
                ? { ...layer, active: true }
                : { ...layer, active: false };
        });

        setSketchpadLayers(updatedLayers);
    }

    return (
        <div className="ml-24 max-w-512 w-full">
            <FuseChipSelect
                value={values}
                onChange={handleActiveLayersChange}
                placeholder="Bestehende Notizen ein/ausblenden"
                textFieldProps={{ variant: 'standard' }}
                options={options}
                isMulti
                variant="fixed"
                id="sketchpad-layer-select"
            />
        </div>
    );
};

export default LayersSelect;
