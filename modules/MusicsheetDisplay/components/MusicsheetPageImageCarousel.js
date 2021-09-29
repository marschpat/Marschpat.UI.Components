import React, { useContext, useEffect, useRef, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import MusicsheetPagesLoader from './MusicsheetPagesLoader';
import { MusicsheetDisplayContext, MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';

const MusicsheetPageImageCarousel = () => {
    const imageGalleryEl = useRef();
    const [pageImages, setPageImages] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const { musicsheetPages } = useContext(MusicsheetLoaderContext);
    const { isCarouselFullscreen, setIsCarouselFullscreen, showPagesPreview, sketchpadLayers } =
        useContext(MusicsheetDisplayContext);

    const [imagesLoadedCount, setImagesLoadedCount] = useState(0);

    useEffect(() => {
        const images = musicsheetPages.map(item => ({ original: item.downloadLink, thumbnail: item.downloadLink }));
        setPageImages(images);
    }, [musicsheetPages]);

    useEffect(() => {
        if (isCarouselFullscreen) {
            imageGalleryEl.current.fullScreen();
        }
    }, [isCarouselFullscreen]);

    useEffect(() => {
        initializeSketchpadLayers();
    }, [sketchpadLayers, imagesLoadedCount]);

    function allImagesInitialized(event) {
        setImagesLoadedCount(prev => (prev += 1));
    }

    function initializeSketchpadLayers() {
        if (allImagesLoaded()) {
            const slideWrapper = imageGalleryEl.current && imageGalleryEl.current.imageGallerySlideWrapper.current;
            if (slideWrapper && sketchpadLayers.length > 0) {
                const container = document.createElement('div');
                const layerWrapper = document.createElement('div');
                container.className = 'absolute inset-0';
                const layers = sketchpadLayers
                    .filter(layer => layer.active && getCurrentPageFromLayer(layer))
                    .map(layer => {
                        const img = document.createElement('img');
                        img.src = getCurrentPageFromLayer(layer).data;
                        img.className = 'absolute top-0';
                        return img;
                    });

                layers.forEach(layer => {
                    layerWrapper.appendChild(layer);
                });
                container.appendChild(layerWrapper);
                slideWrapper.insertBefore(container, null);
            }
        }
    }

    function getCurrentPageFromLayer(layer) {
        return layer.data.find(i => i.pageIndex === currentPageIndex);
    }

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
                    onBeforeSlide={nextIndex => setCurrentPageIndex(null)}
                    onSlide={currentIndex => setCurrentPageIndex(currentIndex)}
                    onErrorImageURL="/assets/images/musiclibrary/IMAGE_ERROR_1.jpg"
                    onImageLoad={allImagesInitialized}
                />
            </div>
        </MusicsheetPagesLoader>
    );
};

export default MusicsheetPageImageCarousel;
