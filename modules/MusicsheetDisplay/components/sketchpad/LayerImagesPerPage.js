import React, { useContext } from 'react';
import { MusicsheetDisplayContext } from '../../context/MusicsheetDisplayContexts';

const LayerImagesPerPage = props => {
    const { sketchpadLayers } = useContext(MusicsheetDisplayContext);

    function getCurrentPageFromLayer(layer) {
        return layer.data.find(i => i.pageIndex === props.page.pageIndex);
    }

    return sketchpadLayers
        .filter(layer => layer.active && getCurrentPageFromLayer(layer))
        .map(layer => (
            <img
                src={getCurrentPageFromLayer(layer).data}
                key={layer.uuid}
                style={{ maxHeight: 'calc(100vh - 80px)' }}
            />
        ));
};

export default LayerImagesPerPage;
