import React, { useContext, useEffect, useRef, useState } from 'react';
import Loading from '../Loading';
import LoadingError from '../LoadingError';
import LayerControls from './LayerControls';
import SketchpadDrawPage from './SketchpadDrawPage';
import { useTranslation } from 'react-i18next';

import {
    MusicsheetLoaderContext,
    MusicsheetDisplayContext,
} from '../../context/MusicsheetDisplayContexts';
import useFetchMusicsheetPages from '../../utils/useFetchMusicsheetPages';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import { v4 as uuidv4 } from 'uuid';

const Sketchpad = () => {
    const { t } = useTranslation(['msd']);
    const { musicsheetMetaData, instrumentVoice } = useContext(MusicsheetLoaderContext);
    const { setSketchpadLayers, persistSketchpadLayerInDb, toggleViewMode } =
        useContext(MusicsheetDisplayContext);
    const { fetchMusicsheetPages, musicsheetPages, isLoading, hasError } =
        useFetchMusicsheetPages();

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

    useEffect(() => {
        fetchMusicsheetPages(sheetId, voiceId);
    }, [sheetId, voiceId]);

    function handleLayerNameChange(name) {
        setLayerInCreation(prev => ({ ...prev, name }));
    }

    async function handlePersistLayer() {
        const layerPages = drawPagesRefs.current
            .map(drawPage => drawPage.getCanvasDrawPageLayerObject())
            .filter(el => el);
        if (layerPages.length < 1) {
            alert(t('MSD_NOTE_EMPTY'));
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
        <div>
            {musicsheetPages && (
                <div>
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
                </div>
            )}
            {hasError && <LoadingError errorMsg={hasError} />}
            {isLoading && <Loading />}
        </div>
    );
};

export default Sketchpad;
