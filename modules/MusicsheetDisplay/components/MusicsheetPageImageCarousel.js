import React, { useContext, useEffect, useRef, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { MusicsheetDisplayContext, MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import LayerImagesPerPage from './sketchpad/LayerImagesPerPage';

const MusicsheetPageImageCarousel = () => {
    const ImageGalleryEl = useRef();
    const { musicsheetPages } = useContext(MusicsheetLoaderContext);
    const { isCarouselFullscreen, setIsCarouselFullscreen, showPagesPreview } = useContext(MusicsheetDisplayContext);
    const [pageImages, setPageImages] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    useEffect(() => {
        const images = musicsheetPages.map(item => ({ original: item.downloadLink, thumbnail: item.downloadLink }));
        setPageImages(images);
    }, [musicsheetPages]);

    useEffect(() => {
        if (isCarouselFullscreen) {
            ImageGalleryEl.current.fullScreen();
        }
    }, [isCarouselFullscreen]);

    return (
        <div className="relative">
            <ImageGallery
                items={pageImages}
                ref={ImageGalleryEl}
                showIndex={true}
                thumbnailPosition="left"
                showThumbnails={showPagesPreview}
                onScreenChange={e => setIsCarouselFullscreen(e)}
                onBeforeSlide={nextIndex => setCurrentPageIndex(null)}
                onSlide={currentIndex => setCurrentPageIndex(currentIndex)}
                onErrorImageURL="/assets/images/musiclibrary/IMAGE_ERROR_1.jpg"
            />
            <LayerImagesPerPage page={{ pageIndex: currentPageIndex }} />
        </div>
    );
};

export default MusicsheetPageImageCarousel;
