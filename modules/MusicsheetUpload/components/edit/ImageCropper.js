import React, { useState, useEffect, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import ImageCropperToolbar from './ImageCropperToolbar';
import LoadingBusyIndicator from '../LoadingBusyIndicator';

const dimensions = {
    landscape: {
        aspectRatio: 1.41822 / 1,       // landscape pocketbook dimensions: 1448 x 1021
        width: 1800,
    },
    portrait: {
        aspectRatio: 0.70511 / 1,       // portrait pocketbook dimensions: 1021 x 1448
        width: 1270,
    },
}

const ImageCropper = (props) => {
    const cropper = useRef(null);
    const [src, setSrc] = useState(null);
    const [image, setImage] = useState(null);
    const [cropBox, setCropBox] = useState(null);
    const [orientation, setOrientation] = useState(null);
    const [renderCropper, setRenderCropper] = useState(false);

    useEffect(() => {
        setRenderCropper(false);
        setSrc(props.src);
        setCropBox(props.cropBox);
        setOrientation(props.cropBox?.orientation ?? 'landscape');
    }, [props.src, props.cropBox]);

    useEffect(() => {
        setRenderCropper(true);
    }, [cropBox, orientation, src]);

    const onCrop = event => {
        const cropperTarget = cropper.current;
        const image = cropperTarget.getCroppedCanvas({
            width: dimensions[orientation].width,
            // fillColor: '#fff',               // use this for .jpg
            // imageSmoothingEnabled: false,
            // imageSmoothingQuality: 'high',
        }).toDataURL('image/png');              // file size may be drastically increased by this, but we get a .png file
        // }).toDataURL('image/jpeg');          // file size is much better, but we get a .jpg file

        const cropBox = getCurrentCropBox(cropperTarget);
        setImage({
            image,
            cropBox,
        });
    }

    const setInitialCropBox = () => {
        if (cropBox) {
            cropper.current.setCropBoxData(cropBox.cropBoxData);
            cropper.current.rotate(cropBox.rotation);
            cropper.current.setCanvasData(cropBox.canvasData);
        }
    }

    useEffect(() => {
        if (image) {
            props.handlePageImageUpdate(image.image, image.cropBox);
        }
    }, [image]);

    return (
        <div>
            <div className="min-h-512">
                {renderCropper ? (
                    <Cropper
                        ref={cropper}
                        src={src}
                        crop={onCrop}
                        ready={setInitialCropBox}
                        aspectRatio={dimensions[orientation].aspectRatio}
                        autoCropArea={1}
                        guides={true}
                        style={{ height: 500, width: '100%' }}
                        checkOrientation={false}
                    />
                ) : <LoadingBusyIndicator msg="Einen Moment..." />}
            </div>

            <ImageCropperToolbar
                cropper={cropper?.current?.cropper}
                orientation={orientation}
                handleOrientationChange={changeOrientation}
                handleCopyCropbox={copyCropbox}
            />
        </div>
    );

    function getCurrentCropBox(cropperEl = null) {
        let cropperTarget = cropperEl ?? cropper?.current?.cropper;
        const imageData = cropperTarget.getImageData();
        return {
            canvasData: cropperTarget.getCanvasData(),
            cropBoxData: cropperTarget.getCropBoxData(),
            rotation: imageData.rotate ? imageData.rotate : 0,
            orientation,
        };
    };

    function changeOrientation(orientationValue) {
        setRenderCropper(false);
        setOrientation(orientationValue);
    }

    function copyCropbox() {
        const cropBox = getCurrentCropBox();
        props.handleCropBoxOverrideForPages(cropBox);
    }
}

export default ImageCropper;
