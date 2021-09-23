import React, { useContext } from 'react';
import LayerNameInput from './LayerNameInput';
import { SketchpadLayerContext } from '../../context/SketchpadContexts';
import { MusicsheetDisplayContext } from '../../context/MusicsheetDisplayContexts';
import { Button } from '@material-ui/core';

const CreateLayerControls = () => {
    const { setCreateSketchpadLayer } = useContext(SketchpadLayerContext);
    const { toggleViewMode } = useContext(MusicsheetDisplayContext);

    return (
        <div className="md:flex md:items-center">
            <div>
                <Button onClick={setCreateSketchpadLayer} variant="contained">
                    Notiz anlegen
                </Button>
                <Button onClick={toggleViewMode} className="mt-4 md:mt-0 md:ml-12" variant="contained">
                    Abbrechen
                </Button>
            </div>

            <LayerNameInput />
        </div>
    );
};

export default CreateLayerControls;
