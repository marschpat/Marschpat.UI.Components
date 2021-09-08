import React from 'react';
import FileHelper from '../../utils/FileHelper';
import { generateInstrumentSheet } from '../../utils/InstrumentSheetsHelper';
import { loadPdf } from '../../utils/PdfViewerHelpers';
import { copyPageIntoNewPdfDocument, removePageFromPdfDocument } from '../../utils/PdfModifierHelpers';
import useDispatchConfirmDialog from '@marschpat/local/utils/useDispatchConfirmDialog';
import Button from '@material-ui/core/Button';
import EjectIcon from '@material-ui/icons/Eject';

const PageExtractor = props => {
    const fileType = props.originalFile.type;
    const dispatchConfirm = useDispatchConfirmDialog();

    const handelExtractPage = async () => {
        const [newInstrumentSheet, replacement] = await extractPage();
        const manipulationObject = {
            add: [newInstrumentSheet],
            replacement: replacement,
        };
        props.handleOriginalFileManipulation(manipulationObject);
    };

    const handleExtractPageClick = () => {
        dispatchConfirm(
            handelExtractPage,
            `Seite ${props.pageNbr} aus dem Dokument extrahieren?`,
            `Seite ${props.pageNbr} wirklich aus dem Dokument entfernen und als neue Instrumentenstimme anlegen? (Diese Aktion kann nicht rückgängig gemacht werden)`,
            'Ja, extrahieren'
        );
    };

    return (
        <Button
            onClick={handleExtractPageClick}
            variant="outlined"
            title={`Seite ${props.pageNbr} als neue Instrumentenstimme (Datei) extrahieren`}
            className={props.className}
        >
            <EjectIcon />
            <span className="ml-10">Seite {props.pageNbr} extrahieren</span>
        </Button>
    );

    async function extractPage() {
        if (fileType !== 'pdf') {
            return extractOriginalFileWithSinglePage();
        }

        // if it's an pdf
        const pdf = await loadPdf(props.originalFile.data);
        if (pdf.numPages === 1) {
            return extractOriginalFileWithSinglePage();
        }

        return await extractPageFromOriginalFileWithMultiPages(pdf);
    }

    /**
     * For any given originalFile it returns an InstrumentSheet containing only the current page and
     * an InstrumentSheet containing everytghing except the current page.
     *
     * @returns array - [newInstrumentSheet, replacement]
     */
    function extractOriginalFileWithSinglePage() {
        const newInstrumentSheet = generateInstrumentSheetFromOriginalFile(props.originalFile.data);
        const documentPageNbr = props.pages.find(page => page.pageNbr === props.pageNbr).documentPageNbr;
        const replacement = props.currentInstrumentSheet;
        replacement.origFiles = replacement.origFiles.filter(file => file.uuid !== props.originalFile.uuid);
        replacement.pages = replacement.pages.filter(page => page.pageNbr !== documentPageNbr);
        if (replacement.previews) {
            replacement.previews = replacement.previews.filter(preview => preview.pageNbr !== documentPageNbr);
        }

        return [newInstrumentSheet, replacement];
    }

    /**
     *
     * @returns
     */
    async function extractPageFromOriginalFileWithMultiPages() {
        const documentPageNbr = props.pages.find(page => page.pageNbr === props.pageNbr).documentPageNbr;

        const [newDocData, origPdfDocument] = await copyPageIntoNewPdfDocument(
            props.originalFile.data,
            documentPageNbr
        );
        const newInstrumentSheet = generateInstrumentSheetFromOriginalFile(newDocData);

        const newOrigPdfDocData = await removePageFromPdfDocument(origPdfDocument, documentPageNbr);
        const replacement = getInstrumentSheetReplacement(newOrigPdfDocData, props.pageNbr, props.originalFile.uuid);

        return [newInstrumentSheet, replacement];
    }

    /**
     * Generate the new instrumentSheet
     *
     * @param {string} newDocData - base64 data uri
     * @returns {object} - instrumentSheet
     */
    function generateInstrumentSheetFromOriginalFile(newDocData) {
        const data = props.originalFile.type !== 'mxl' ? newDocData : props.originalFile.blob;
        const newFileName = composeExtractedFileName();
        const fileObj = FileHelper.createFakeFileObject(data, newFileName, fileType);
        const newInstrumentSheet = generateInstrumentSheet(fileObj);
        newInstrumentSheet.pages = props.currentInstrumentSheet.pages
            .filter(page => page.pageNbr === props.pageNbr)
            .map((page, index) => ({ ...page, pageNbr: index + 1 }));
        if (props.currentInstrumentSheet.previews) {
            newInstrumentSheet.previews = props.currentInstrumentSheet.previews
                .filter(preview => preview.pageNbr === props.pageNbr)
                .map((preview, index) => ({ ...preview, pageNbr: index + 1 }));
        }

        return newInstrumentSheet;
    }

    /**
     * Generate the new instrumentSheet which is gonna replace the current one.
     *
     * @param {string} originalFileData - base64 data uri
     * @param {number} pageNbr
     * @returns {object} - instrumentSheet
     */
    function getInstrumentSheetReplacement(originalFileData, pageNbr, uuid) {
        const newOrigFileObj = FileHelper.createFakeFileObject(originalFileData, props.originalFile.name, fileType);
        newOrigFileObj.uuid = uuid;
        const mock = generateInstrumentSheet(newOrigFileObj);
        const replacement = props.currentInstrumentSheet;
        replacement.origFiles[props.originalFileIndex] = mock.origFiles[0];
        replacement.pages = replacement.pages
            .filter(page => page.pageNbr !== pageNbr)
            .map((page, index) => ({ ...page, pageNbr: index + 1 }));
        if (replacement.previews) {
            replacement.previews = replacement.previews
                .filter(preview => preview.pageNbr !== pageNbr)
                .map((preview, index) => ({ ...preview, pageNbr: index + 1 }));
        }

        return replacement;
    }

    /**
     * Create a new fileName from originalFile.name
     *
     * @returns string
     */
    function composeExtractedFileName() {
        const timestamp = Date.now();
        const fileNameParts = props.originalFile.name.split('.');
        const fileExtension = fileNameParts.pop();
        return `${fileNameParts[0]}_ext_${timestamp}.${fileExtension}`;
    }
};

export default PageExtractor;
