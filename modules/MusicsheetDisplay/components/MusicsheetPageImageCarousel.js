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
        //     const newContents = <LayerImagesPerPage page={{ pageIndex: currentPageIndex }} />;
        //     console.log('new contenets', newContents);
        //     // slideWrapper.insertBefore(newContents, null);
        // }
    }, [musicsheetPages]);

    useEffect(() => {
        if (isCarouselFullscreen) {
            ImageGalleryEl.current.fullScreen();
        }
    }, [isCarouselFullscreen]);

    // function loadLayerImages(event) {
    //     console.log('okay loaded', event);
    //     const newNode = <div>foo</div>;
    //     const galleryImg = event.target;
    //     galleryImg.insertBefore(newNode, null);
    // }

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
                    // onImageLoad={loadLayerImages}
                />
                <div className="mx-auto absolute inset-0 flex justify-center" style={{ width: 'calc(100% - 110px)' }}>
                    <LayerImagesPerPage page={{ pageIndex: currentPageIndex }} />
                </div>
            </div>
        </MusicsheetPagesLoader>
    );
};

export default MusicsheetPageImageCarousel;
