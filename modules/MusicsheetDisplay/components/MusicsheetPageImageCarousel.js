import React, { useContext, useEffect, useRef, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { MusicsheetDisplayContext, MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';

const MusicsheetPageImageCarousel = () => {
    const { musicsheetPages } = useContext(MusicsheetLoaderContext);
    const { isCarouselFullscreen, setIsCarouselFullscreen, showPagesPreview } = useContext(MusicsheetDisplayContext);
    const ImageGalleryEl = useRef();
    const [pageImages, setPageImages] = useState([]);

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
        <ImageGallery
            items={pageImages}
            ref={ImageGalleryEl}
            showIndex={true}
            thumbnailPosition="left"
            onErrorImageURL="/assets/images/musiclibrary/IMAGE_ERROR_1.jpg"
            onScreenChange={e => setIsCarouselFullscreen(e)}
            showThumbnails={showPagesPreview}
        />
    );
};

export default MusicsheetPageImageCarousel;
