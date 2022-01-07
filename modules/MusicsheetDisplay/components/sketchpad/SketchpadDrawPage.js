import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import PageLayerModeControl from './PageLayerModeControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

const SketchpadDrawPage = forwardRef((props, ref) => {
    const canvasDrawEl = useRef();
    const [layerOptions, setLayerOptions] = useState(null);
    const [pageDimensions, setPageDimensions] = useState(null);

    // fetch pageimage for pageIndex again to determine original image dimensions
    // @ToDo double requests: find a better way to do this!
    useEffect(() => {
        fetchImageDimensions();
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

    async function fetchImageDimensions() {
        const { success, data } = await fetchMusicsheetVoicePage(props.page.musicSheetId, props.page.voiceId, props.page.pageIndex);
        if (success) {
            const img = new Image();
            img.src = data.downloadLink;
            img.onload = () => {
                setPageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
            }
        }
    }

    async function fetchMusicsheetVoicePage(sheetId, voiceId, pageIndex) {
        try {
            // @ToDo: Backend: be sure to return a new **unique** link here!
            const response = await axios.post(`musiclibrary/${sheetId}/download/${voiceId}/${pageIndex}`);
            const success = response?.data ? true : false;
            const data = success ? response.data : 'invalid API response (no data)';
            return { success, data };
        } catch (error) {
            const errorMsg = error?.response?.data?.message;
            console.error('Error while fechtching musicsheet downloadLink occured:', errorMsg);

            return { success: false, data: errorMsg };
        }
    }

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
            {layerOptions && pageDimensions && (
                <div className="py-24 w-full flex justify-center">
                    <CanvasDraw
                        ref={canvasDrawEl}
                        imgSrc={props.page.downloadLink}
                        canvasWidth={pageDimensions.width}
                        canvasHeight={pageDimensions.height}
                        brushColor={layerOptions.color}
                        brushRadius={layerOptions.size}
                        hideGrid={true}
                        lazyRadius={0}
                    />
                </div>
            )}
            {!pageDimensions && (
                <div className="flex justify-center">
                    <CircularProgress />
                </div>
            )}
            <div className="mb-12 text-right text-gray-700">Seite {props.page.pageIndex + 1}</div>
        </div>
    );
});

export default SketchpadDrawPage;
