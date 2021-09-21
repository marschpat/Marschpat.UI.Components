import React from 'react';
import LayersSelect from './LayersSelect';
import CreateLayerControls from './CreateLayerControls';

const LayerControls = () => {
    return (
        <div className="flex justify-between items-center">
            <CreateLayerControls />
            <LayersSelect />
        </div>
    );
};

export default LayerControls;
