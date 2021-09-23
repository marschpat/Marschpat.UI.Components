import React, { useContext, useEffect, useState } from 'react';
import LayerImagesPerPage from './LayerImagesPerPage';
import PageLayerModeControl from './PageLayerModeControl';
import { SketchpadContext } from '../../context/SketchpadContexts';
import CanvasDraw from 'react-canvas-draw';

const SketchpadPage = props => {
    const [layerOptions, setLayerOptions] = useState(null);
    const [pageDimensions, setPageDimensions] = useState(null);
    const { isCreateActive } = useContext(SketchpadContext);

    useEffect(() => {
        // determine page images original size
        const img = new Image();
        img.src = props.page.downloadLink;
        img.onload = () =>
            setPageDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
    }, []);

    return (
        <div className="mt-24 border-b">
            <PageLayerModeControl handleLayerOptionsChange={option => setLayerOptions(option)} />
            {!isCreateActive && (
                <div className="relative">
                    <img src={props.page.downloadLink} className="w-full" />

                    <LayerImagesPerPage page={props.page} />
                </div>
            )}
            {isCreateActive && layerOptions && pageDimensions && (
                <CanvasDraw
                    imgSrc={props.page.downloadLink}
                    canvasWidth={pageDimensions.width}
                    canvasHeight={pageDimensions.height}
                    hideGrid={true}
                />
            )}
        </div>
    );
};

export default SketchpadPage;
