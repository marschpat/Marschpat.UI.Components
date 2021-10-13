import React, { useContext, useState } from 'react';
import PageEditor from './PageEditor';
import PagesOverview from './PagesOverview';
import PageImageExporter from './PageImageExporter';
import StoreInstrumentSheet from './StoreInstrumentSheet';
import OriginalFileManipulator from './OriginalFileManipulator';
import VoicesAssignmentSelection from './VoicesAssignmentSelection';
import { UploaderContext } from '../../context/UploaderContext';
import useGeneratePages from '../../utils/useGeneratePages';
import { findOrigFileForPage } from '../../utils/InstrumentSheetsHelper';
import useInDebugMode from '@marschpat/Marschpat.UI.Components/utils/useInDebugMode';
import LoadingBusyIndicator from '@marschpat/Marschpat.UI.Components/components/LoadingBusyIndicator';
import Typography from '@material-ui/core/Typography';

const supportedTypes = ['image', 'pdf', 'mxl'];

const InstrumentSheetEditor = props => {
    const [pages, setPages, pageInEdit, setPageInEdit, originalFile, setOriginalFile, previews] =
        useGeneratePages(props.instrumentSheet, supportedTypes, true);
    const [assignedVoices, setAssignedVoices] = useState(props.instrumentSheet.voices ?? null);
    const renderPagesPreview =
        (props.instrumentSheet.origFiles.length === 1 &&
            props.instrumentSheet.origFiles[0].type !== 'mxl') ||
        props.instrumentSheet.origFiles.length > 1;
    const inDebugMode = useInDebugMode();
    const { dispatchFlashMessage, handleAvailableVoicesUpdate } = useContext(UploaderContext);

    return pageInEdit ? (
        <div className="flex">
            <div className="max-w-200 w-full">
                <PagesOverview
                    previews={previews}
                    renderPagesPreview={renderPagesPreview}
                    pageNbrInEdit={pageInEdit?.pageNbr}
                    handlePageInEditChange={changePageInEdit}
                />
            </div>
            <div className="flex-1">
                <div className="flex-1 flex">
                    <div className="flex-1">
                        <PageEditor
                            page={pageInEdit}
                            originalFile={originalFile}
                            supportedTypes={supportedTypes}
                            handlePageUpdate={updateEditedPage}
                            handleCropBoxOverrideForPages={applyCropBoxOverrideForPages}
                            handleCloseOnError={closeEditor}
                        />
                        {inDebugMode && (
                            <PageImageExporter
                                data={
                                    pages && pageInEdit
                                        ? pages.find(page => page.fileId === pageInEdit.fileId)
                                              ?.pageData
                                        : null
                                }
                            />
                        )}
                        {inDebugMode && (
                            <div className="my-20 flex justify-end">
                                <div>OriginalFile name: {originalFile.name}</div>
                                <div className="ml-20">pageNbr: {pageInEdit?.pageNbr}</div>
                            </div>
                        )}
                        {inDebugMode && (
                            <div className="my-20 flex justify-end">
                                <div className="w-full flex justify-center">
                                    <img
                                        src={
                                            pages && pageInEdit
                                                ? pages.find(
                                                      page => page.fileId === pageInEdit.fileId
                                                  )?.pageData
                                                : null
                                        }
                                        className="border rounded-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {pages.length > 0 && (
                            <OriginalFileManipulator
                                pages={pages}
                                pageNbr={pageInEdit?.pageNbr}
                                currentInstrumentSheet={props.instrumentSheet}
                                handleOriginalFileManipulation={
                                    props.handleOriginalFileManipulation
                                }
                            />
                        )}
                    </div>
                    <div className="max-w-400 w-full flex justify-end">
                        <div className="w-full ml-36">
                            <div className="mb-24 flex flex-grow-0">
                                <Typography variant="h6">Besetzung:</Typography>
                                <Typography variant="h6" className="ml-12">
                                    {props.castName}
                                </Typography>
                            </div>
                            <VoicesAssignmentSelection
                                assignedVoices={assignedVoices}
                                handleVoicesAssignemnt={setAssignedVoices}
                            />
                        </div>
                    </div>
                </div>

                <StoreInstrumentSheet
                    handleStoreInstrumentSheet={handleStoreInstrumentSheet}
                    handleNextInstrumentSheet={handleStoreAndNext}
                />
            </div>
        </div>
    ) : (
        <LoadingBusyIndicator msg="Einen Moment, Datei wird geladen und zur Bearbeitung aufbereitet." />
    );

    /* Update the currently edited page */
    function updateEditedPage(editedPage) {
        setPages(prevPages => {
            return prevPages.map(page => (page.pageNbr === editedPage.pageNbr ? editedPage : page));
        });
    }

    /**
     * Store the current state of the InstrumentSheet.
     * Update the remaining available voices, so that an already
     * assigned voice can't be assigned again to another InstrumentSheet.
     */
    function handleStoreInstrumentSheet() {
        storeAndUpdateVoices();
        closeEditor();
    }

    /**
     * Store the current state of the InstrumentSheet and open the next (or previous) one.
     */
    function handleStoreAndNext(e, direction = 'next') {
        storeAndUpdateVoices();
        props.handleNextInstrumentSheet(direction);
    }

    /**
     * Store the current InstrumentSheet and update available instrument voices
     */
    function storeAndUpdateVoices() {
        persistCurrentInstrumentSheet();
        handleAvailableVoicesUpdate();
        dispatchFlashMessage('Instrumentenstimme gespeichert', 'success');
    }

    /* Build the final InstrumentSheet Object and pass it up to parent component (MusicsheetUploadIndex) */
    function persistCurrentInstrumentSheet() {
        const editedSheet = {
            ...props.instrumentSheet,
            pages,
            previews,
            voices: assignedVoices,
        };
        props.handleInstrumentSheetUpdate(editedSheet);
    }

    /* Close the InstrumentSheetEditor and clear the component state */
    function closeEditor() {
        setPages([]);
        setPageInEdit(null);
        setAssignedVoices([]);
        props.handleClose();
    }

    /* Either set the page with the corresponding pageNbr, or the first page in pages array, as pageInEdit */
    function changePageInEdit(pageNbr) {
        if (!pages || pages.length < 1) return;
        const page = pages.find(page => page.pageNbr === pageNbr) ?? pages[0];
        setOriginalFile(findOrigFileForPage(page, props.instrumentSheet.origFiles));
        setPageInEdit(page);
    }

    /* * Override the cropBox for all pages */
    function applyCropBoxOverrideForPages(cropBox) {
        const newPages = pages.map(page => {
            page.cropBox = cropBox;
            return page;
        });
        setPages(newPages);
        dispatchFlashMessage('Auswahl für alle Seiten im File übernommen', 'success');
    }
};

export default InstrumentSheetEditor;
