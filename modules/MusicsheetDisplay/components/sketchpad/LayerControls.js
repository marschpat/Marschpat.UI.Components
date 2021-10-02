import React from 'react';
import LayersSelect from './LayersSelect';
import CreateLayerControls from './CreateLayerControls';

const LayerControls = props => {
    return (
        <div className="md:flex md:justify-between md:items-center">
            <CreateLayerControls {...props} />
            <LayersSelect />
        </div>
    );
};

export default LayerControls;
