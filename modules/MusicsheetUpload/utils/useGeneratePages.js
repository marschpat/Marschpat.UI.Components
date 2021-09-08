import { useState, useEffect } from 'react';
import { findOrigFileForPage } from './InstrumentSheetsHelper';
import { loadPdf, renderPageAsImage } from './PdfViewerHelpers';

/**
 * Encapsulates all functionallity regarding generating the initial pages array,
 * setting the initial pageInEdit, generating preview images, prerendering all initial pages, etc.
 * Manages state of pages and pageInEdit. It can render and get the initial pages from pdf documents.
 *
 * @param {object} instrumentSheet
 */
const useGeneratePages = (instrumentSheet, supportedTypes) => {
    const thumbnailWidth = 120;
    const [pages, setPages] = useState([]);
    const [previews, setPreviews] = useState(null);
    const [pageInEdit, setPageInEdit] = useState(null);
    const [originalFile, setOriginalFile] = useState(null);
    const [currentPageNbr, setCurrentPageNbr] = useState(1);
    const originalFiles = instrumentSheet.origFiles;

    /**
     * Set the Pages for each actual page within the instrument file.
     * (Mainly used for .pdf documents. all other types just have one page.)
     */
    useEffect(() => {
        async function getPages() {
            if (!instrumentSheet) return;
            const { pagesArray, previews } = await getPagesArrayFromInstrumentSheet();
            const firstPage = pagesArray[0];
            const origFile = findOrigFileForPage(firstPage, originalFiles);
            setPages(pagesArray);
            setPreviews(previews);
            setOriginalFile(origFile);
            setPageInEdit(firstPage);
        }
        getPages();
    }, [instrumentSheet]);

    return [pages, setPages, pageInEdit, setPageInEdit, originalFile, setOriginalFile, previews];

    /**
     * Return an object containing all pages and previews of the InstrumentSheet in current edit for each originalFile.
     * Asynchronous, if it's a pdf it waits for renderPdfPages to resolve.
     *
     * @returns {object}
     */
    async function getPagesArrayFromInstrumentSheet() {
        const pagesPerOriginalFiles = {
            newPages: [],
            existingPages: []
        };

        for (const [index, origFile] of originalFiles.entries()) {
            const hasPages = originalFileHasExistingPages(origFile.uuid);
            const hasPreviews = originalFileHasPreviews(origFile.uuid);

            // it has pages (and previews), copy them later.
            // btw: check for previews is only needed because of
            // "edit old musicsheets in MARSCHPAT (Marching) Web App".
            if (hasPages && hasPreviews) {
                pagesPerOriginalFiles.existingPages.push(origFile.uuid);
                continue;
            }

            // it doesn't has pages, add new onews
            const supportedType = supportedTypes.includes(origFile.type);
            let pagesFromOrigFile = {
                previews: [],
                origFileIndex: 1,
                pagesCount: 1
            };

            // Generate the appropiate pages depending on originalFile type
            if (origFile.type === 'pdf' && supportedType) {
                pagesFromOrigFile = await renderPdfPages(origFile);
            }
            if (origFile.type === 'image' && supportedType) {
                pagesFromOrigFile = await getImagePreview(origFile);
            }
            if (origFile.type === 'mxl' && supportedType) {
                pagesFromOrigFile = {
                    previews: [],
                    origFileIndex: 1,
                    pagesCount: 1
                };
            }

            pagesPerOriginalFiles.newPages.push({
                previews: pagesFromOrigFile.previews,
                preRenderedImages: pagesFromOrigFile.preRenderedImages ?? null,
                origFileIndex: index,
                pagesCount: pagesFromOrigFile.pagesCount
            });
        }

        const finalPagesArray = generatePagesArray(pagesPerOriginalFiles);

        return {
            pagesArray: finalPagesArray.pagesArray,
            previews: finalPagesArray.previews
        };
    }

    function originalFileHasExistingPages(originalFileUuid) {
        return instrumentSheet.pages.some(page => page.belongsToOrigFile === originalFileUuid);
    }

    function originalFileHasPreviews(originalFileUuid) {
        const pages = instrumentSheet.pages.filter(page => page.belongsToOrigFile === originalFileUuid);
        const previewExistPerPage = pages.map(page => {
            if (page.type === 'mxl') return true;
            return instrumentSheet.previews.some(preview => preview.pageNbr === page.pageNbr);
        });
        return previewExistPerPage.length > 0 && previewExistPerPage.every(Boolean);
    }

    /**
     * Generates all the new pages and copies the existingPages from InstrumentSheet
     * @param {object}
     * @returns {object}
     */
    function generatePagesArray({ newPages, existingPages }) {
        let pageNbr = 1;
        const previews = [];
        const pagesArray = [];

        // copy previews, existing pages and calculate new pageNbrs
        if (existingPages.length > 0) {
            if (instrumentSheet.previews) {
                const previewsCopy = instrumentSheet.previews.map((preview, index) => ({
                    ...preview,
                    pageNbr: pageNbr + index
                }));
                previews.push(...previewsCopy);
            }

            for (const uuid of existingPages) {
                const pagesForOrigFile = instrumentSheet.pages
                    .filter(page => page.belongsToOrigFile === uuid)
                    .map(page => {
                        const copiedPage = { ...page, pageNbr: pageNbr };
                        pageNbr += 1;
                        return copiedPage;
                    });
                pagesArray.push(...pagesForOrigFile);
            }
        }

        // create new pages
        if (newPages.length > 0) {
            for (const newPageCandidate of newPages) {
                let documentPageNbr = 1;
                const origFileIndex = newPageCandidate.origFileIndex;
                for (let i = 0; i < newPageCandidate.pagesCount; i++) {
                    const preRendered = newPageCandidate.preRenderedImages
                        ? { ...newPageCandidate.preRenderedImages[i] }
                        : false;

                    pagesArray.push({
                        pageData: preRendered ? preRendered.pageData : originalFiles[origFileIndex].data,
                        type: originalFiles[origFileIndex].type,
                        cropBox: null,
                        pageNbr,
                        documentPageNbr,
                        orientation: 'landscape',
                        belongsToOrigFile: originalFiles[origFileIndex].uuid
                    });

                    const preview = newPageCandidate.previews[i];
                    previews.push({ ...preview, pageNbr, documentPageNbr });

                    pageNbr += 1;
                    documentPageNbr += 1;
                }
            }
        }

        return { pagesArray, previews };
    }

    /**
     * Resize the original image for a smaller thumbnail version
     * @returns {object}
     */
    async function getImagePreview(originalFile) {
        const img = document.createElement('img');
        const canvas = document.createElement('canvas');
        let thumbnailData = originalFile.data; // fallback
        img.src = originalFile.data;
        canvas.width = thumbnailWidth;
        canvas.height = (thumbnailWidth * img.height) / img.width;
        canvas.getContext('2d').drawImage(img, 0, 0, thumbnailWidth, (thumbnailWidth * img.height) / img.width);
        if (img.naturalWidth !== 0) {
            thumbnailData = canvas.toDataURL('image/jpeg');
        }
        const imagePreview = {
            pagesCount: 1,
            previews: [
                {
                    pageNbr: currentPageNbr,
                    thumbnail: thumbnailData
                }
            ]
        };
        setCurrentPageNbr(currentPageNbr + 1);

        return imagePreview;
    }

    /**
     * Read the pdf document and find out how many pages there are.
     * Prerender all pages as fullsized images, and as preview thumbnails.
     * Asynchronous, waits for pdfjs promise to resolve.
     *
     * @returns {object}
     */
    async function renderPdfPages(originalFile) {
        const pdf = await loadPdf(originalFile.data);
        const numberOfPages = pdf.numPages;
        let pagesPreviews = [];
        let preRenderedImages = [];
        for (let i = 1; i <= numberOfPages; i++) {
            const pageData = await renderPageAsImage(pdf, i, 1800);
            const thumbnailData = await renderPageAsImage(pdf, i, thumbnailWidth);
            preRenderedImages.push({ pageNbr: i, pageData });
            pagesPreviews.push({ pageNbr: i, thumbnail: thumbnailData });
        }

        return {
            pagesCount: numberOfPages,
            previews: pagesPreviews,
            preRenderedImages
        };
    }
};

export default useGeneratePages;
