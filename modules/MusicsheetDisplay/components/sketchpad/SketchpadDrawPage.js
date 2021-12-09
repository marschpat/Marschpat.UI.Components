import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import PageLayerModeControl from './PageLayerModeControl';
import CircularProgress from '@material-ui/core/CircularProgress';

const SketchpadDrawPage = forwardRef((props, ref) => {
    const canvasDrawEl = useRef();
    const [layerOptions, setLayerOptions] = useState(null);
    const [pageDimensions, setPageDimensions] = useState(null);
    const [pageImage, setPageImage] = useState(null);

    useEffect(() => {
        // determine page images original size
        // @ToDo find a better way to do this!
        const img = new Image();
        img.src = props.page.downloadLink;
        img.onload = () => {
            setPageDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
            setPageImage(img);
        };
    }, []);

    // expose function to ref
    useImperativeHandle(ref, () => ({
        getCanvasDrawPageLayerObject() {
            if (isCanvasBlank()) return null;
            const data = canvasDrawEl.current.canvasContainer.children[1].toDataURL();
            return {
                data: data,
                sheetId: props.page.musicSheetId,
                voiceId: props.page.voiceId,
                pageIndex: props.page.pageIndex,
            };
        },
    }));

    function isCanvasBlank() {
        const canvas = canvasDrawEl.current.canvasContainer.children[1];
        return !canvas
            .getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height)
            .data.some(channel => channel !== 0);
    }

    function undoDraw(e) {
        canvasDrawEl.current.undo();
    }

    return (
        <div className="mt-24 border-b">
            <PageLayerModeControl
                handleLayerOptionsChange={option => setLayerOptions(option)}
                handleUndoDraw={undoDraw}
            />
            {layerOptions && pageImage && (
                <div className="py-24 w-full flex justify-center">
                    <CanvasDraw
                        ref={canvasDrawEl}
                        imgSrc={pageImage.src}
                        canvasWidth={pageDimensions.width}
                        canvasHeight={pageDimensions.height}
                        brushColor={layerOptions.color}
                        brushRadius={layerOptions.size}
                        hideGrid={true}
                    />
                </div>
            )}
            {!pageImage && (
                <div className="flex justify-center">
                    <CircularProgress />
                </div>
            )}
            <div className="mb-12 text-right text-gray-700">Seite {props.page.pageIndex + 1}</div>
        </div>
    );
});

export default SketchpadDrawPage;
