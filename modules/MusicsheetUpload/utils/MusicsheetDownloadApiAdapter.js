import { MP_EDU, MP_WEB } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';

class MusicsheetDownloadApiAdapter {
    constructor(rawApiData, implementationMode = MP_WEB) {
        this.rawData = rawApiData;
        this.implementationMode = implementationMode;
    }

    getInstrumentSheets() {
        return this.rawData.instrumentSheets.map(rawSheet => {
            const voicesClean = this.mapVoices(rawSheet.voices);
            const origFilesClean = this.mapOriginalFiles(rawSheet.origFiles);
            const pagesClean = this.mapPages(rawSheet.pages);

            return {
                voices: voicesClean,
                origFiles: origFilesClean,
                pages: pagesClean,
                previews: rawSheet.previews,
                uuid: origFilesClean[0].uuid,
            };
        });
    }

    getMetaData() {
        return {
            title: this.rawData.title || '',
            subtitle: this.rawData.subTitle || '',
            arrangerId: this.rawData.arrangeurId || 0,
            arranger: this.rawData.customArrangeur || '',
            composerId: this.rawData.composerId || 0,
            composer: this.rawData.customComposer || '',
            publisherId: this.rawData.publisherId || 0,
            publisher: this.rawData.customPublisher || '',
            copyright: this.rawData.copyright || '',
            iswc: this.rawData.iswc || '',
            castId: this.rawData.castId || null,
            tags: this.rawData.tags || null,
        };
    }

    getUploadScope() {
        const ownerTypeMap = {
            0: 'public',
            1: 'organisation',
            2: 'private',
        };

        return ownerTypeMap[this.rawData.ownerType] ?? 'private';
    }

    /**
     * We could provide voiceOptions here and set the actual voice item.
     * Right now we're just returning the id and label provided in the edit data download
     */
    mapVoices(voices, voiceOptions = null) {
        if (this.implementationMode === MP_EDU) {
            return voices;
        }

        return voices.map(voice => {
            const voiceId = voice.voiceID;
            if (!voiceOptions) {
                return { value: voiceId, label: voice.label, voiceID: voiceId };
            }
            const voiceOption = voiceOptions.find(item => item.voiceID === voiceId);
            return (
                voiceOption ?? {
                    value: voiceId,
                    label: 'Stimme noch nicht bearbeitet',
                    voiceID: voiceId,
                }
            );
        });
    }

    mapOriginalFiles(origFiles) {
        return origFiles.map(origFile => {
            const newOrigFile = { ...origFile };
            if (origFile.type === 'mxl') {
                newOrigFile.blob = origFile.dataBinary;
                delete newOrigFile.dataBinary;
            }

            return newOrigFile;
        });
    }

    mapPages(pages) {
        return pages.map(page => ({
            pageData: page.type === 'mxl' ? page.mxlImages : page.data,
            type: page.type,
            pageNbr: page.pageNbr,
            orientation: page.orientation,
            belongsToOrigFile: page.origFile,
            cropBox: page.options?.cropbox ?? null,
            osmdOptions: page.options?.osmdOptions ?? null,
        }));
    }
}

export default MusicsheetDownloadApiAdapter;
