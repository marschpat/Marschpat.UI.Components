import React, { useContext, useEffect, useRef } from 'react';
import { SketchpadLayerContext } from '../../context/SketchpadContexts';
import useSketchpadDrawFunctions from '../../utils/useSketchpadDrawFunctions';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';

const PageLayerBlank = props => {
    const canvasEl = useRef(null);
    const inDebug = useInDebugMode();

    const { updateLayerInCreationData, layerInCreation } = useContext(SketchpadLayerContext);

    const [setCtx, drawDot, drawFree, stopDrawing, fillText] = useSketchpadDrawFunctions(props.mode);

    /**
     * On mount initialize pageLayer canvas
     * On unmount unregister all global event listener
     */
    useEffect(() => {
        initializeSketchpadPageLayer();

        return () => {
            window.removeEventListener('mouseup', stopDrawing);
        };
    }, []);

    useEffect(() => {
        if (layerInCreation.action === 'create') {
            // @ToDo: original size of parent image
            const data = canvasEl.current.toDataURL();
            createPageLayerObject(data);
        }
    }, [layerInCreation]);

    function initializeSketchpadPageLayer() {
        const canvas = canvasEl.current;
        if (!canvas.getContext) return false;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        setCtx(ctx);
        window.addEventListener('mouseup', stopDrawing);
    }

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
        const canvas = canvasEl.current;
        return !canvas
            .getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height)
            .data.some(channel => channel !== 0);
    }

    return (
        <canvas
            ref={canvasEl}
            className="absolute inset-0"
            // Event listeners for 'draw' and 'marker'
            {...((props.mode.name === 'draw' || props.mode.name === 'marker') && {
                onMouseDown: drawDot,
                onTouchStart: drawDot,
                onMouseMove: drawFree,
                onTouchMove: drawFree,
            })}
            // Event listeners for 'text'
            {...(props.mode.name === 'text' && {
                onClick: fillText,
            })}
        ></canvas>
    );
};

export default PageLayerBlank;
