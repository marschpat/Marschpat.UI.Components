export const generateInstrumentSheet = originalFile => {
    return {
        voices: [],
        origFiles: [
            {
                name: originalFile.file.name,
                type: originalFile.extensionType,
                data: originalFile.dataUrlString,
                blob: originalFile?.blob ?? null,
                uuid: originalFile.uuid,
            },
        ],
        pages: [],
        uuid: originalFile.uuid,
    };
};

export const findOrigFileForPage = (page, originalFiles) => {
    if (!page || !page?.belongsToOrigFile || !originalFiles || originalFiles.length < 1) return false;

    return originalFiles.find(orig => page.belongsToOrigFile === orig.uuid);
};

export const getCompletionStatus = instrumentSheet => {
    const voicesReady = () => instrumentSheet.voices.length > 0;
    const pagesReady = () => {
        if (instrumentSheet.pages.length < 1) return false;
        if (!eachOrigFileHasPages()) return false;
        return true;
    };
    const completed = voicesReady() && pagesReady();

    return [completed, voicesReady, pagesReady];

    function eachOrigFileHasPages() {
        return instrumentSheet.origFiles.every(f => instrumentSheet.pages.some(p => p.belongsToOrigFile === f.uuid));
    }
};
