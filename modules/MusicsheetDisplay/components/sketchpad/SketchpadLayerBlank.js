import React, { useContext, useState } from 'react';
import { SketchpadLayerContext } from '../../context/SketchpadContexts';
import { MusicsheetDisplayContext } from '../../context/MusicsheetDisplayContexts';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import { v4 as uuidv4 } from 'uuid';

const SktechpadLayerBlank = props => {
    const initialLayer = () => ({
        uuid: uuidv4(),
        name: null,
        options: null,
        active: false,
        pages: [],
        sheetId: props.sheetId,
        voiceId: props.voiceId,
    });
    const [layerInCreation, setLayerInCreation] = useState(initialLayer);
    const { setSketchpadLayers, persistSketchpadLayer, toggleViewMode } = useContext(MusicsheetDisplayContext);
    const inDebug = useInDebugMode();

    function setLayerInCreationName(name) {
        setLayerInCreation(prev => ({ ...prev, name }));
    }

    async function handlePersistLayer() {
        if (layerInCreation.pages.length < 1) {
            alert('Notiz ist leer');
            return false;
        }
        await persistLayerInCreation();
        resetLayerInCreation();
        toggleViewMode();
        if (inDebug) downloadLayerImages();
    }

    function persistLayerInCreation() {
        const newLayer = {
            uuid: layerInCreation.uuid,
            name: layerInCreation.name,
            pages: layerInCreation.pages,
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

    function updateLayerInCreationData(layerPage) {
        setLayerInCreation(prev => {
            let newPages = prev.pages;
            newPages.push({
                pageIndex: layerPage.pageIndex,
                data: layerPage.data,
            });

            return { ...prev, pages: newPages };
        });
    }

    function resetLayerInCreation() {
        setLayerInCreation(initialLayer);
    }

    function downloadLayerImages() {
        layerInCreation.pages.forEach(layerPage => {
            const link = document.createElement('a');
            link.download = `sketchpad-layer-${props.sheetId}-${props.voiceId}-pageIndex${layerPage.pageIndex}.png`;
            link.href = layerPage.data;
            link.click();
            link.delete;
        });
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
