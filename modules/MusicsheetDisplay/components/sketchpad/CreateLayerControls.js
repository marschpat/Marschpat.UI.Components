import React, { useContext } from 'react';
import LayerNameInput from './LayerNameInput';
import { MusicsheetDisplayContext } from '../../context/MusicsheetDisplayContexts';
import { Button } from '@material-ui/core';

const CreateLayerControls = props => {
    const { toggleViewMode } = useContext(MusicsheetDisplayContext);

    return (
        <div className="md:flex md:items-center">
            <div>
                <Button onClick={props.handlePersistLayer} variant="contained">
                    Notiz anlegen
                </Button>
                <Button onClick={toggleViewMode} className="mt-4 md:mt-0 md:ml-12" variant="contained">
                    Abbrechen
                </Button>
            </div>

            <LayerNameInput handleLayerNameChange={props.handleLayerNameChange} />
        </div>
    );
};

export default CreateLayerControls;
