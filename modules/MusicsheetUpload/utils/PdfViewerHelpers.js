/**
 * Utilizes Mozilla's PDF Viewer library https://github.com/mozilla/pdf.js
 * Attention: webpack/worker-loader must be installed! https://github.com/webpack-contrib/worker-loader
 * Alse see pdf.js webpack examples: https://github.com/mozilla/pdf.js/tree/master/examples/webpack
 **/
import * as pdfjsLib from 'pdfjs-dist/webpack';

/**
 * Loads a pdf from dataUrlString and returns pdf.js pdf Object
 *
 * @param {*} data pdf as dataUrlString
 * @returns Object
 */
export const loadPdf = async data => {
    return pdfjsLib.getDocument(data).promise.then(pdf => {
        return pdf;
    });
};

/**
 * Renders a page from a given pdf object into .png dataUrl image
 *
 * @param {*} pdf
 * @param {*} pageNbr
 * @param {*} outputWith
 * @returns string
 */
export const renderPageAsImage = async (pdf, pageNbr, outputWith = 1800) => {
    let page = null;
    try {
        page = await pdf.getPage(pageNbr);
    } catch (e) {
        console.error('error while rendering pdf page as image ', e);
    }
    if (!page) return false;

    const viewport = page.getViewport({ scale: 1 });
    const scaledViewport = page.getViewport({
        scale: outputWith / viewport.width,
    });

    // Create and scale canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    // Render the page and convert it to dataUrl
    await page.render({ canvasContext: context, viewport: scaledViewport })
        .promise;
    const image = canvas.toDataURL();
    // const image = canvas.toDataURL('image/jpeg');        // convert to .jpeg for much smaller fileszize, but shittier quality

    // Unset
    canvas.remove();

    return image;
};
