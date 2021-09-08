/**
 * Wording and implementation details for
 * MARSCHPAT WebApp - https://web.marschpat.com/
 */
export const MP_WEB = 1;

/**
 * Wording and implementation details for
 * MARSCHPAT Education - https://web-edu-dev.marschpat.com/
 */
export const MP_EDU = 2;

/**
 * **************************************
 * ImplementationMode specific varieties
 * **************************************
 */

/** Implementation details for varying API endpoints */
export const apiRoutes = {
    [MP_WEB]: {
        musiclibrary: '/musiclibary/tags'
    },
    [MP_EDU]: {
        musiclibrary: '/musiclibrary/tags'
    }
};

/** Implementation details for varying API endpoints */
export const clientRoutes = {
    [MP_WEB]: {
        musiclibrary: '/musiclibary'
    },
    [MP_EDU]: {
        musiclibrary: '/musiclibrary'
    }
};
