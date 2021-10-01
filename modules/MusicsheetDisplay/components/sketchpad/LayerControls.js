import React from 'react';
import LayersSelect from './LayersSelect';
import CreateLayerControls from './CreateLayerControls';

const LayerControls = props => {
    return (
        <div className="flex justify-between items-center">
            <CreateLayerControls {...props} />
            <LayersSelect />
        </div>
    );
};

export default LayerControls;
