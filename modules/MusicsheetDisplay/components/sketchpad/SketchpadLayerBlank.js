import React, { useContext, useState } from 'react';
import { MusicsheetDisplayContext } from '../../context/MusicsheetDisplayContexts';
import { SketchpadLayerContext } from '../../context/SketchpadContexts';
import { v4 as uuidv4 } from 'uuid';

const SktechpadLayerBlank = props => {
    const initialLayer = () => ({
        uuid: uuidv4(),
        name: null,
        options: null,
        active: false,
        data: [],
        sheetId: props.sheetId,
        voiceId: props.voiceId,
    });
    const [layerInCreation, setLayerInCreation] = useState(initialLayer);
    const { setSketchpadLayers, persistSketchpadLayer, toggleViewMode } = useContext(MusicsheetDisplayContext);

    function setLayerInCreationName(name) {
        setLayerInCreation(prev => ({ ...prev, name }));
    }

    async function handlePersistLayer() {
        if (layerInCreation.data.length < 1) {
            alert('Notiz ist leer');
            return false;
        }
        await persistLayerInCreation();
        resetLayerInCreation();
        toggleViewMode();
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

            return { ...prev, data: newData };
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
                handlePersistLayer,
            }}
        >
            {props.children}
        </SketchpadLayerContext.Provider>
    );
};

export default SktechpadLayerBlank;
