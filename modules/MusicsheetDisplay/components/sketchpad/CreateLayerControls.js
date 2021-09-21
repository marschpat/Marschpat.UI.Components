import React, { useContext } from 'react';
import LayerNameInput from './LayerNameInput';
import { SketchpadContext, SketchpadLayerContext } from '../../context/SketchpadContexts';

import { Button } from '@material-ui/core';

const CreateLayerControls = () => {
    const { isCreateActive, setIsCreateActive } = useContext(SketchpadContext);
    const { setCreateSketchpadLayer } = useContext(SketchpadLayerContext);

    return (
        <div>
            {!isCreateActive && (
                <Button onClick={() => setIsCreateActive(true)} variant="contained">
                    Neue Notizen anlegen
                </Button>
            )}
            {isCreateActive && (
                <div className="md:flex md:items-center">
                    <div>
                        <Button onClick={setCreateSketchpadLayer} variant="contained">
                            Notiz anlegen
                        </Button>
                        <Button
                            onClick={() => setIsCreateActive(false)}
                            className="mt-4 md:mt-0 md:ml-12"
                            variant="contained"
                        >
                            Abbrechen
                        </Button>
                    </div>

                    <LayerNameInput />
                </div>
            )}
        </div>
    );
};

export default CreateLayerControls;
