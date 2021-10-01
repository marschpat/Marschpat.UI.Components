import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PageLayerModeControl from './PageLayerModeControl';
import { SketchpadLayerContext } from '../../context/SketchpadContexts';
import CanvasDraw from 'react-canvas-draw';

const SketchpadDrawPage = forwardRef((props, ref) => {
    const canvasDrawEl = useRef();
    const [layerOptions, setLayerOptions] = useState(null);
    const [pageDimensions, setPageDimensions] = useState(null);
    const { updateLayerInCreationData, handlePersistLayer } = useContext(SketchpadLayerContext);

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

    // expose function
    useImperativeHandle(ref, () => ({
        getAlert() {
            alert('getAlert from Child');
        },
    }));

    function getCanvasDrawData(e) {
        const data = canvasDrawEl.current.canvasContainer.children[1].toDataURL();
        createPageLayerObject(data);
    }

    function createPageLayerObject(data) {
        const layerPage = {
            data: data,
            sheetId: props.page.musicSheetId,
            voiceId: props.page.voiceId,
            pageIndex: props.page.pageIndex,
        };
        updateLayerInCreationData(layerPage);
    }

    function persistLayer() {
        getCanvasDrawData();
        handlePersistLayer();
    }

    return (
        <div className="mt-24 border-b">
            <PageLayerModeControl handleLayerOptionsChange={option => setLayerOptions(option)} />
            {layerOptions && pageDimensions && (
                <div className="py-24 w-full flex justify-center">
                    {/* <button onClick={persistLayer}>per</button> */}
                    <CanvasDraw
                        ref={canvasDrawEl}
                        imgSrc={props.page.downloadLink}
                        // onChange={getCanvasDrawData}
                        canvasWidth={pageDimensions.width}
                        canvasHeight={pageDimensions.height}
                        brushColor={layerOptions.color}
                        brushRadius={layerOptions.size}
                        hideGrid={true}
                    />
                </div>
            )}
            <div className="mb-12 text-right text-gray-700">Seite {props.page.pageIndex + 1}</div>
        </div>
    );
});

export default SketchpadDrawPage;
