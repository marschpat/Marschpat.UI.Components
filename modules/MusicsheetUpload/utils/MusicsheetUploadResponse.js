class MusicsheetUploadResponse {

    constructor(apiResponse) {
        this.apiResponse = apiResponse;
        this.data = apiResponse.data;
    }

    /**
     * Check if there are any validation errors
     * coming from the backend API.
     */
    hasValidationErrors() {
        return this.data.statusMessage == 'Error' && this.data.messages.length > 0;
    }

    /**
     * Check if the sheetMusic file was persisted
     */
    isSheetMusicPersisted() {
        return this.data.statusMessage == 'Success' ? true : false;
    }

    /**
     * Check if there's a Sheet Music suggested
     */
    isSimilarSheetMusicSuggested() {
        return this.data.statusMessage === 'Error' &&
            this.data.similarFilesExists &&
            this.data.similarFiles.length > 0;
    }
}

export default MusicsheetUploadResponse;
