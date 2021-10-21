import React, { useContext, useRef, useState } from 'react';
import LayerControls from './LayerControls';
import SketchpadDrawPage from './SketchpadDrawPage';
import MusicsheetPagesLoader from '../MusicsheetPagesLoader';
import {
    MusicsheetLoaderContext,
    MusicsheetDisplayContext,
} from '../../context/MusicsheetDisplayContexts';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import { v4 as uuidv4 } from 'uuid';

const Sketchpad = () => {
    const { musicsheetPages, musicsheetMetaData, instrumentVoice } =
        useContext(MusicsheetLoaderContext);
    const { setSketchpadLayers, persistSketchpadLayerInDb, toggleViewMode } =
        useContext(MusicsheetDisplayContext);
    const voiceId = instrumentVoice.voiceId;
    const sheetId = musicsheetMetaData.sheetId;
    const initialLayer = () => ({
        uuid: uuidv4(),
        name: null,
        options: null,
        active: false,
        pages: [],
        sheetId,
        voiceId,
    });
    const [layerInCreation, setLayerInCreation] = useState(initialLayer);
    const inDebug = useInDebugMode();
    const drawPagesRefs = useRef([]);

    function handleLayerNameChange(name) {
        setLayerInCreation(prev => ({ ...prev, name }));
    }

    async function handlePersistLayer() {
        const layerPages = drawPagesRefs.current
            .map(drawPage => drawPage.getCanvasDrawPageLayerObject())
            .filter(el => el);
        if (layerPages.length < 1) {
            alert('Notiz ist leer');
            return false;
        }
        await persistLayerInCreation(layerPages);
        resetLayerInCreation();
        toggleViewMode();
        if (inDebug) downloadLayerImages();
    }

    async function persistLayerInCreation(layerPages) {
        const newLayer = {
            ...layerInCreation,
            pages: layerPages,
        };
        setSketchpadLayers(prev => [
            ...prev,
            {
                ...newLayer,
                active: true,
            },
        ]);
        await persistSketchpadLayerInDb(newLayer);
    }

    function resetLayerInCreation() {
        setLayerInCreation(initialLayer);
    }

    function downloadLayerImages() {
        layerInCreation.pages.forEach(layerPage => {
            const link = document.createElement('a');
            link.download = `sketchpad-layer-${sheetId}-${voiceId}-pageIndex${layerPage.pageIndex}.png`;
            link.href = layerPage.data;
            link.click();
            link.delete();
        });
    }

    return (
        <MusicsheetPagesLoader>
            <LayerControls
                handleLayerNameChange={handleLayerNameChange}
                handlePersistLayer={handlePersistLayer}
            />
            {musicsheetPages.map((page, index) => (
                <SketchpadDrawPage
                    ref={el => (drawPagesRefs.current[index] = el)}
                    page={page}
                    key={index}
                />
            ))}
        </MusicsheetPagesLoader>
    );
};

export default Sketchpad;
