import React, { useState, useEffect } from 'react';
import ImageCropper from './ImageCropper';
import { loadPdf, renderPageAsImage } from '../../utils/PdfViewerHelpers';
import LoadingBusyIndicator from '@marschpat/Marschpat.UI.Components/components/LoadingBusyIndicator';
import { useTranslation } from 'react-i18next';

const PdfToImageConverter = props => {
    const { t } = useTranslation(['uploader']);
    const [imgSrc, setImgSrc] = useState(null);
    const [pageNbr, setPageNbr] = useState(1);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const renderPageNbr = async (pdf, pageNbr) => {
        setIsLoading(true);
        const img = await renderPageAsImage(pdf, pageNbr);
        setImgSrc(img);
        setPageNbr(pageNbr);
    };

    // Render the first page of the PDF Document for ImageCropper
    useEffect(() => {
        loadPdf(props.data).then(pdf => {
            setPdfDocument(pdf);
            renderPageNbr(pdf, 1);
        });
    }, [props.data]);

    // When pageNbr updates, render the corresponding page
    useEffect(() => {
        const newPageNbr = props.documentPageNbr;
        if (newPageNbr !== pageNbr && pdfDocument) {
            renderPageNbr(pdfDocument, newPageNbr);
        }
    }, [props.documentPageNbr]);

    // When pdf rendering is finished (and an imgSrc set) disable loading state and render ImageCropper
    useEffect(() => {
        if (imgSrc) setIsLoading(false);
    }, [imgSrc]);

    return !isLoading ? (
        <ImageCropper
            src={imgSrc}
            cropBox={props.cropBox}
            handlePageImageUpdate={props.handlePageImageUpdate}
            handleCropBoxOverrideForPages={props.handleCropBoxOverrideForPages}
        />
    ) : (
        <div style={{ height: 584 }}>
            <LoadingBusyIndicator msg={t('UPLOADER_PDF_LOADING')} />
        </div>
    );
};

export default PdfToImageConverter;
