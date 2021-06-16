/**
 * Utilizes PDF LIB library to create and modify PDF documents.
 * https://github.com/Hopding/pdf-lib
 **/
// import { PDFDocument } from 'pdf-lib';

export const createPdfDocument = async () => {
    return await PDFDocument.create();
}

export const loadPdf = async (pdfData) => {
    return await PDFDocument.load(pdfData);
}

export const savePdf = async (pdfDoc) => {
    return await pdfDoc.saveAsBase64({ dataUri: true });
}

const getPageIndex = pageNbr => (pageNbr > 0) ? pageNbr - 1 : 0;

/**
 * Copy pageNbr from originalPdfData into new Pdf document and
 * return the new Pdf file as base64 dataUri (data:application/pdf;base64)
 *
 * @param {string} originalPdfData - base64 dataUri data:application/pdf;base64
 * @param {number} pageNbr
 * @returns [newPdf, originalPdf]
 */
export async function copyPageIntoNewPdfDocument(originalPdfData, pageNbr = 1) {
    const pageIndex = getPageIndex(pageNbr);
    const originalPdf = await loadPdf(originalPdfData);
    const pdfDoc = await createPdfDocument();
    const [donorPage] = await pdfDoc.copyPages(originalPdf, [pageIndex]);
    pdfDoc.addPage(donorPage);
    const newPdf = await savePdf(pdfDoc);

    return [newPdf, originalPdf];
}

export async function removePageFromPdfDocument(pdfDocument, pageNbr = 1) {
    const pageIndex = getPageIndex(pageNbr);
    pdfDocument.removePage(pageIndex);

    return await savePdf(pdfDocument);
}
