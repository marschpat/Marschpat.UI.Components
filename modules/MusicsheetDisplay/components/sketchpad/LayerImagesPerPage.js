import React, { useContext } from 'react';
import { SketchpadContext } from '../../context/SketchpadContexts';

const LayerImagesPerPage = props => {
    const { sketchpadLayers } = useContext(SketchpadContext);

    function getCurrentPageFromLayer(layer) {
        return layer.data.find(i => i.pageIndex === props.page.pageIndex);
    }

    return sketchpadLayers
        .filter(layer => layer.active && getCurrentPageFromLayer(layer))
        .map(layer => <img src={getCurrentPageFromLayer(layer).data} className="absolute inset-0" key={layer.id} />);
};

export default LayerImagesPerPage;
