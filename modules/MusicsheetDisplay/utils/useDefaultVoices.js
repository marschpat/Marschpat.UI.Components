function useDefaultVoices() {
    // get the first voice that isn't one of our "excluded voices"
    // see https://github.com/marschpat/Marschpat.UI.Web/issues/587
    // or: if there's a valid "favorite voice" persisted in local storage, take that one
    function findDefaultVoice(musicsheet) {
        const favoriteVoice = checkForFavoriteVoice(musicsheet.voices);
        if (favoriteVoice) {
            return favoriteVoice;
        }

        let defaultVoice = null;
        for (let i = 0; i < musicsheet.voices.length; i++) {
            const voice = musicsheet.voices[i];
            if (detectRenderType(voice) === 'rendered') {
                defaultVoice = voice;
                break;
            }
            if (detectRenderType(voice) === 'mxl' && isAllowedAsDefaultVoice(voice.voiceId)) {
                defaultVoice = voice;
                break;
            }
            defaultVoice = voice;
        }

        return defaultVoice;
    }

    /**
     * Check if a favorite voice (favVoice) exists in local storage.
     * If that voice is an "available voice" on the requested musicsheet return it as sugested default voice
     *
     * @param {array} availableVoices
     * @returns object | bool
     */
    function checkForFavoriteVoice(availableVoices) {
        if (localStorage.getItem('favVoice')) {
            const favVoice = JSON.parse(localStorage.getItem('favVoice'));
            const validFavVoice = isExistingVoice(favVoice.voiceId, availableVoices);
            if (validFavVoice) return favVoice;
        }

        return false;
    }

    function isExistingVoice(voiceId, availableVoices) {
        return availableVoices.some(existingVoice => existingVoice.voiceId === voiceId);
    }

    /**
     * Find the apropriate render type
     *
     * @param {*} voice
     * @param {*} type
     * @returns string
     */
    function detectRenderType(voice, type) {
        if (voice.mxlAvailable && type === 'mxl') {
            return type;
        }
        if (voice.renderedAvailable && type === 'rendered') {
            return type;
        }
        if (voice.mxlAvailable) {
            return 'mxl';
        }
        if (voice.renderedAvailable) {
            return 'rendered';
        }
    }

    /**
     * If possible don't select any of these defined voices as default
     *
     * @param {*} voiceId
     * @param {*} excludeVoiceIds
     * @returns boolean
     */
    function isAllowedAsDefaultVoice(voiceId, excludeVoiceIds = []) {
        const notDefaultIfOtherVoicesExist = [1, 2, 73, 74];

        return (
            !notDefaultIfOtherVoicesExist.includes(voiceId) && !excludeVoiceIds.includes(voiceId)
        );
    }

    /**
     * Return corresponding voice. If no voice with this voiceId exists, return default voice
     *
     * @param {object} musicsheet
     * @param {int} voiceId
     * @returns object
     */
    function voiceFromId(musicsheet, voiceId) {
        const voice = musicsheet.voices.find(voice => voice.voiceId === parseInt(voiceId));
        if (!voice) {
            return findDefaultVoice(musicsheet);
        }

        return voice;
    }

    return { findDefaultVoice, voiceFromId, isExistingVoice };
}

export default useDefaultVoices;
