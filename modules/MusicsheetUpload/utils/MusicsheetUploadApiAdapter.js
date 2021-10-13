import { MP_EDU, MP_WEB } from './ImplementationModesLookup';

class MusicsheetUploadApiAdapter {
    constructor(rawPayload, implementationMode = MP_WEB, humanReadable = false) {
        this.rawPayload = rawPayload;
        this.humanReadable = humanReadable;
        this.implementationMode = implementationMode;
    }

    /**
     * API Payload Adapter.
     * Return instrumentSheets array, transformed to fit our API endpoint "store" action.
     * POST /api/v1/musicsheet-upload
     */
    getCleanInstrumentSheets() {
        return this.rawPayload.instrumentSheets.map(sheet => {
            const origFilesClean = this.cleanUpOrigFiles(sheet.origFiles, sheet.pages);
            const voicesClean = this.cleanUpVoices(sheet.voices);
            const pagesClean = this.cleanUpPages(sheet.pages);
            return {
                voices: voicesClean,
                origFiles: origFilesClean,
                pages: pagesClean,
                previews: sheet.previews,
            };
        });
    }

    cleanUpOrigFiles(origFiles) {
        return origFiles.map(origFile => {
            const newOrigFile = { ...origFile };
            if (origFile.type === 'mxl') {
                newOrigFile.dataBinary = !this.humanReadable
                    ? origFile.blob
                    : 'SOME-BINARY-RUBBISH';
                delete newOrigFile.data;
            }
            delete newOrigFile.blob;

            return newOrigFile;
        });
    }

    cleanUpPages(pages) {
        if (pages && pages.length > 0) {
            // Rename pageData, build options array,
            const newPages = pages.map(page => {
                const finalPage = {
                    data: page.pageData,
                    type: page.type,
                    pageNbr: page.pageNbr,
                    orientation: page.orientation,
                    origFile: page.belongsToOrigFile,
                    options: {
                        cropbox: page.cropBox,
                    },
                };

                if (page.type === 'mxl') {
                    finalPage.mxlImages = page.pageData;
                    finalPage.options.osmdOptions = page?.osmdOptions ?? null;
                    delete finalPage.data;
                }

                return finalPage;
            });
            return newPages;
        }

        return pages;
    }

    cleanUpVoices(voices) {
        if (this.implementationMode === MP_EDU) {
            return voices;
        }

        return voices.map(voice => ({
            voiceId: voice.voiceId,
            label: voice.label,
        }));
    }
}

export default MusicsheetUploadApiAdapter;
