import React, { useContext, useEffect, useRef, useState } from 'react';
import PageLayerBlank from './PageLayerBlank';
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
            {isCreateActive && layerOptions && pageDimensions && (
                <CanvasDraw
                    imgSrc={props.page.downloadLink}
                    canvasWidth={pageDimensions.width}
                    canvasHeight={pageDimensions.height}
                    hideGrid={true}
                />
            )}
            <p className="text-right">Seite {props.page.pageIndex + 1}</p>
        </div>
    );
};

export default SketchpadPage;
