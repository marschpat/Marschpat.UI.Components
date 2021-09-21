import React, { useContext, useEffect, useState } from 'react';
import { SketchpadContext } from '../../context/SketchpadContexts';
import FuseChipSelect from '@fuse/core/FuseChipSelect';

const LayersSelect = () => {
    const { sketchpadLayers, setSketchpadLayers } = useContext(SketchpadContext);
    const [values, setValues] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (sketchpadLayers.length > 0) {
            setOptions(
                sketchpadLayers.map(layer => {
                    return { label: layer.name, value: layer.id };
                })
            );
            setValues(sketchpadLayers.filter(l => l.active).map(layer => ({ label: layer.name, value: layer.id })));
        }
    }, [sketchpadLayers]);

    function handleActiveLayersChange(selected) {
        const updatedLayers = sketchpadLayers.map(layer => {
            return selected.map(i => i.value).includes(layer.id)
                ? { ...layer, active: true }
                : { ...layer, active: false };
        });

        setSketchpadLayers(updatedLayers);
    }

    return (
        <div className="ml-24 max-w-640 w-full">
            <FuseChipSelect
                className="w-full"
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
