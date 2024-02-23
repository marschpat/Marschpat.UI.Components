import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import PageLayerModeControl from './PageLayerModeControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const SketchpadDrawPage = forwardRef((props, ref) => {
    const { t } = useTranslation(['msd']);
    const canvasDrawEl = useRef();
    const [layerOptions, setLayerOptions] = useState(null);
    const [pageDimensions, setPageDimensions] = useState(null);

    // fetch pageimage for pageIndex again to determine original image dimensions
    // @ToDo double requests: find a better way to do this! (e.g.: receiving the original image dimensions from the backend)
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
        // sorry for the dirty workaround.
        // we have to make sure to receive a fresh (new) pageImage s3 link here,
        // to avoid chrome / windows bug (chrome blocks the multiple img request).
        // @ToDo: remove setTimeout function (line37 & line46) if backend always returns a unique link for sure
        setTimeout(async () => {
            const { success, data } = await fetchMusicsheetVoicePage(
                props.page.musicSheetId,
                props.page.voiceId,
                props.page.pageIndex
            );
            if (success) {
                const img = new Image();
                img.src = data.downloadLink;
                img.onload = () => {
                    setPageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                };
            }
        }, 1001);
    }

    async function fetchMusicsheetVoicePage(sheetId, voiceId, pageIndex) {
        try {
            // @ToDo: Backend: be sure to return a new **unique** link here!
            const response = await axios.post(
                `v1/musiclibrary/${sheetId}/download/${voiceId}/${pageIndex}`
            );
            const success = response?.data ? true : false;
            const data = success ? response.data : t('MSD_ERROR_NORESPONSE');
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
