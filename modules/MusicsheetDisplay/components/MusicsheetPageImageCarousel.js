import React, { useContext, useEffect, useRef, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { MusicsheetDisplayContext, MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import LayerImagesPerPage from './sketchpad/LayerImagesPerPage';
import MusicsheetPagesLoader from './MusicsheetPagesLoader';

const MusicsheetPageImageCarousel = () => {
    const ImageGalleryEl = useRef();
    const { musicsheetPages } = useContext(MusicsheetLoaderContext);
    const { isCarouselFullscreen, setIsCarouselFullscreen, showPagesPreview } = useContext(MusicsheetDisplayContext);
    const [pageImages, setPageImages] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    useEffect(() => {
        const images = musicsheetPages.map(item => ({ original: item.downloadLink, thumbnail: item.downloadLink }));
        setPageImages(images);

        // const slideWrapper = ImageGalleryEl.current && ImageGalleryEl.current.imageGallerySlideWrapper.current;
        // if (slideWrapper) {
        //     console.log('slidewrapper', slideWrapper);
        //     slideWrapper.className = 'relative';

        //     const container = document.createElement('div');
        //     container.className = 'absolute inset-0';
        //     container.style.backgroundColor = '#3f3f3f';

        //     slideWrapper.insertBefore(container, null);
        // }
    }, [musicsheetPages]);

    useEffect(() => {
        if (isCarouselFullscreen) {
            ImageGalleryEl.current.fullScreen();
        }
    }, [isCarouselFullscreen]);

    return (
        <MusicsheetPagesLoader>
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
                <div
                    className="mx-auto absolute top-0 flex justify-center"
                    style={{ width: 'calc(100% - 110px)', marginLeft: '91px' }}
                >
                    <LayerImagesPerPage page={{ pageIndex: currentPageIndex }} />
                </div>
            </div>
        </MusicsheetPagesLoader>
    );
};

export default MusicsheetPageImageCarousel;
