import React, { useContext } from 'react';
import { MusicsheetDisplayContext } from '../../context/MusicsheetDisplayContexts';
// import { SketchpadContext } from '../../context/SketchpadContexts';

const LayerImagesPerPage = props => {
    const { sketchpadLayers } = useContext(MusicsheetDisplayContext);

    console.log('current', props.page.pageIndex);
    // return sketchpadLayers.map(layer => <img src={layer.data[0].data} className="absolute inset-0" key={layer.uuid} />);

    function getCurrentPageFromLayer(layer) {
        return layer.data.find(i => i.pageIndex === props.page.pageIndex);
    }

    return (
        sketchpadLayers
            .filter(layer => getCurrentPageFromLayer(layer))
            // .filter(layer => layer.active && getCurrentPageFromLayer(layer))
            .map(layer => (
                <img src={getCurrentPageFromLayer(layer).data} className="absolute inset-0" key={layer.uuid} />
            ))
    );
};

export default LayerImagesPerPage;
