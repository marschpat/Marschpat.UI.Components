import React, { useContext, useEffect, useRef, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import MusicsheetPagesLoader from './MusicsheetPagesLoader';
import { MusicsheetDisplayContext, MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';

const MusicsheetGalleryWithSketchpadLayers = () => {
    const imageGalleryEl = useRef();
    const [pageImages, setPageImages] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const { musicsheetPages } = useContext(MusicsheetLoaderContext);
    const { isCarouselFullscreen, setIsCarouselFullscreen, showPagesPreview, sketchpadLayers } =
        useContext(MusicsheetDisplayContext);

    const [imagesLoadedCount, setImagesLoadedCount] = useState(0);

    // set musisheetPages for ImageGallery
    useEffect(() => {
        const images = musicsheetPages.map(item => ({ original: item.downloadLink, thumbnail: item.downloadLink }));
        setPageImages(images);
    }, [musicsheetPages]);

    // handle fullscreen mode requrest from other components
    useEffect(() => {
        if (isCarouselFullscreen) {
            imageGalleryEl.current.fullScreen();
        }
    }, [isCarouselFullscreen]);

    useEffect(() => {
        initializeSketchpadLayers();
    }, [sketchpadLayers, imagesLoadedCount, currentPageIndex]);

    // create layer images and inject them into ImageGallery imageGallerySlideWrapper
    // seems like a hack, but right now there seems no better solution to
    // display the sketachpad layers within react-image-gallery and
    // retain correct positioning and fullscreen mode
    function initializeSketchpadLayers() {
        if (allImagesLoaded()) {
            cleanUpPreviousLayerImages();
            const slideWrapper = imageGalleryEl.current && imageGalleryEl.current.imageGallerySlideWrapper.current;
            if (slideWrapper && sketchpadLayers.length > 0) {
                const container = document.createElement('div');
                const layerWrapper = document.createElement('div');
                container.className = 'absolute inset-0 js-sketchpad-layer';
                layerWrapper.className = 'relative';
                const layers = generateActiveSketchpadLayerImages();

                layers.forEach(layer => {
                    layerWrapper.appendChild(layer);
                });
                container.appendChild(layerWrapper);
                slideWrapper.insertBefore(container, null);
            }
        }
    }

    function generateActiveSketchpadLayerImages() {
        return sketchpadLayers
            .filter(layer => layer.active && getCurrentPageFromLayer(layer))
            .map(layer => {
                const img = document.createElement('img');
                img.src = getCurrentPageFromLayer(layer).data;
                img.className = 'absolute inset-0 mx-auto max-h-screen';
                return img;
            });
    }

    function getCurrentPageFromLayer(layer) {
        return layer.pages.find(i => i.pageIndex === currentPageIndex);
    }

    function cleanUpPreviousLayerImages() {
        const existingLayers = document.querySelectorAll('.js-sketchpad-layer');
        if (existingLayers.length > 0) {
            existingLayers.forEach(existingLayer => existingLayer.remove());
        }
    }

    // workaround to find out if ImageGallery has completely loaded
    function allImagesLoaded() {
        return pageImages.length === imagesLoadedCount;
    }

    return (
        <MusicsheetPagesLoader>
            <div className="relative">
                <ImageGallery
                    items={pageImages}
                    ref={imageGalleryEl}
                    showIndex={true}
                    thumbnailPosition="left"
                    showThumbnails={showPagesPreview}
                    onScreenChange={e => setIsCarouselFullscreen(e)}
                    onBeforeSlide={nextIndex => {
                        setCurrentPageIndex(nextIndex);
                        initializeSketchpadLayers();
                    }}
                    onImageLoad={e => setImagesLoadedCount(prev => (prev += 1))}
                    onErrorImageURL="/assets/images/musiclibrary/IMAGE_ERROR_1.jpg"
                />
            </div>
        </MusicsheetPagesLoader>
    );
};

export default MusicsheetGalleryWithSketchpadLayers;
