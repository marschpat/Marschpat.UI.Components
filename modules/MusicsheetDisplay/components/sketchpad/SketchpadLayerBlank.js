import React, { useContext, useEffect, useState } from 'react';
import { MusicsheetDisplayContext } from '../../context/MusicsheetDisplayContexts';
import { SketchpadContext, SketchpadLayerContext } from '../../context/SketchpadContexts';
import { v4 as uuidv4 } from 'uuid';

const SktechpadLayerBlank = props => {
    const initialLayer = () => ({
        uuid: uuidv4(),
        name: null,
        action: null,
        options: null,
        active: false,
        data: [],
        sheetId: props.sheetId,
        voiceId: props.voiceId,
    });
    const [layerInCreation, setLayerInCreation] = useState(initialLayer);
    const { persistSketchpadLayer } = useContext(SketchpadContext);
    const { setSketchpadLayers } = useContext(MusicsheetDisplayContext);

    // on close check if there's a layerInCreation that should be persisted
    useEffect(() => {
        if (layerInCreation.action === 'create') {
            persistLayerInCreation();
            resetLayerInCreation();
        }
    }, [layerInCreation]);

    function setLayerInCreationName(name) {
        setLayerInCreation(prev => ({ ...prev, name }));
    }

    function setCreateSketchpadLayer() {
        setLayerInCreation(prev => ({ ...prev, action: 'create' }));
    }

    function persistLayerInCreation() {
        const newLayer = {
            uuid: layerInCreation.uuid,
            name: layerInCreation.name,
            data: layerInCreation.data,
            sheetId: layerInCreation.sheetId,
            voiceId: layerInCreation.voiceId,
        };
        setSketchpadLayers(prev => [
            ...prev,
            {
                ...newLayer,
                active: true,
            },
        ]);
        persistSketchpadLayer(newLayer);
    }

    function updateLayerInCreationData(layerObject) {
        setLayerInCreation(prev => {
            let newData = prev.data;
            newData.push({
                pageIndex: layerObject.pageIndex,
                data: layerObject.data,
            });

            return { ...prev, action: null, data: newData };
        });
    }

    function resetLayerInCreation() {
        setLayerInCreation(initialLayer);
    }

    return (
        <SketchpadLayerContext.Provider
            value={{
                layerInCreation,
                updateLayerInCreationData,
                setLayerInCreationName,
                setCreateSketchpadLayer,
            }}
        >
            {props.children}
        </SketchpadLayerContext.Provider>
    );
};

export default SktechpadLayerBlank;
