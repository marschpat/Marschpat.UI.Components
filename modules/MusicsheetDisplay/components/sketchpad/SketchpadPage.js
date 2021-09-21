import React, { useContext, useRef, useState } from 'react';
import PageLayerBlank from './PageLayerBlank';
import LayerImagesPerPage from './LayerImagesPerPage';
import PageLayerModeControl from './PageLayerModeControl';
import { SketchpadContext } from '../../context/SketchpadContexts';

const SketchpadPage = props => {
    const [layerOptions, setLayerOptions] = useState(null);
    const { isCreateActive } = useContext(SketchpadContext);
    const imageEl = useRef();

    // @ToDo: #59 sketchpad: resize all layer images to original image width before submit
    console.log('image el', {
        imageEl,
        width: imageEl.current ? imageEl.current.width : '',
        height: imageEl.current ? imageEl.current.height : '',
        natWidth: imageEl.current ? imageEl.current.naturalWidth : '',
        natHeight: imageEl.current ? imageEl.current.naturalHeight : '',
    });

    return (
        <div className="mt-24 border-b">
            <PageLayerModeControl handleLayerOptionsChange={option => setLayerOptions(option)} />
            <div className="relative">
                <img ref={imageEl} src={props.page.downloadLink} className="w-full" />

                <LayerImagesPerPage page={props.page} />

                {isCreateActive && layerOptions && <PageLayerBlank page={props.page} mode={layerOptions} />}
            </div>
            <p className="text-right">Seite {props.page.pageIndex + 1}</p>
        </div>
    );
};

export default SketchpadPage;
