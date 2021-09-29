import React, { useContext, useEffect, useRef, useState } from 'react';
import PageLayerModeControl from './PageLayerModeControl';
import { SketchpadLayerContext } from '../../context/SketchpadContexts';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import CanvasDraw from 'react-canvas-draw';

const SketchpadPage = props => {
    const canvasDrawEl = useRef();
    const [layerOptions, setLayerOptions] = useState(null);
    const [pageDimensions, setPageDimensions] = useState(null);
    const { updateLayerInCreationData, layerInCreation } = useContext(SketchpadLayerContext);
    const inDebug = useInDebugMode();

    useEffect(() => {
        // determine page images original size
        // @ToDo find a better way to do this!
        const img = new Image();
        img.src = props.page.downloadLink;
        img.onload = () =>
            setPageDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
    }, []);

    useEffect(() => {
        if (layerInCreation.action === 'create') {
            // @ToDo: Don't persist layer if canvas is empty
            // @ToDo: Persist saveData as well, for loading within SketchpadPage afterwards
            const saveData = canvasDrawEl.current.getSaveData();
            const data = canvasDrawEl.current.canvasContainer.children[1].toDataURL();
            // console.log('saveData?', saveData);
            // console.log('data?', data);
            createPageLayerObject(data);
        }
    }, [layerInCreation]);

    function createPageLayerObject(data) {
        if (isCanvasBlank()) return false;

        const layer = {
            data: data,
            sheetId: props.page.musicSheetId,
            voiceId: props.page.voiceId,
            pageIndex: props.page.pageIndex,
        };
        updateLayerInCreationData(layer);
        if (inDebug) downloadLayer(data);
    }

    function downloadLayer(data) {
        const link = document.createElement('a');
        link.download = `sketchpad-layer-${props.page.musicSheetId}-${props.page.voiceId}-pageIndex${props.page.pageIndex}.png`;
        link.href = data;
        link.click();
        link.delete;
    }

    function isCanvasBlank() {
        const canvas = canvasDrawEl.current.canvasContainer.children[1];
        return !canvas
            .getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height)
            .data.some(channel => channel !== 0);
    }

    return (
        <div className="mt-24 border-b">
            <PageLayerModeControl handleLayerOptionsChange={option => setLayerOptions(option)} />
            {layerOptions && pageDimensions && (
                <div className="py-24 w-full flex justify-center">
                    <CanvasDraw
                        ref={canvasDrawEl}
                        imgSrc={props.page.downloadLink}
                        canvasWidth={pageDimensions.width}
                        canvasHeight={pageDimensions.height}
                        hideGrid={true}
                    />
                </div>
            )}
            <div className="mb-12 text-right text-gray-700">Seite {props.page.pageIndex + 1}</div>
        </div>
    );
};

export default SketchpadPage;
