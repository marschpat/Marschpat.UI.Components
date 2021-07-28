import React, { useState, useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay-marschpat';
import MxlControlToolbar from '../edit/MxlControlToolbar';
import LoadingModal from '@marschpat/Marschpat.UI.Components/components/LoadingModal';
import LoadingBusyIndicator from '@marschpat/Marschpat.UI.Components/components/LoadingBusyIndicator';

const defaultOsmdOptions = {
    zoom: 1,
    drawTitle: false,
    drawSubtitle: false,
    skyBottomDistance: 3,
    drawingParameters: "default",
};

const MxlToImageConverter = props => {
    const osmdEl = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pageImages, setPageImages] = useState(null);
    const [pagesCount, setPagesCount] = useState(null);
    const [osmdOptions, setOsmdOptions] = useState(defaultOsmdOptions);

    useEffect(() => {
        const options = props.osmdOptions ?? defaultOsmdOptions;
        removeRenderedOsmdImages();
        setOsmdOptions(options);
    }, [props.osmdOptions])

    useEffect(() => {
        setIsLoading(true);
        osmdInit();
    }, [osmdOptions]);

    useEffect(() => {
        if (pageImages) {
            setIsLoading(false);
            props.handlePageImageUpdate(pageImages, null, osmdOptions);
        }
    }, [pageImages]);

    return (
        <div>
            <MxlControlToolbar
                pagesCount={pagesCount}
                osmdOptions={osmdOptions}
                handleZoom={renderZoomLevel}
                handleShowTitleChange={changeShowTitle}
                handleCompactModeChange={changeCompactMode}
                handleSkyBottomDistanceChange={changeSkyBottomDistance}
            />
            {pageImages ? (
                pageImages.map(img => (
                    <div className="my-20 relative renderedOsmd" id={`renderedOsmdImage${img.pageNbr}`} key={Math.random()}>
                        <span className="absolute bottom-0 right-0 m-6 text-gray-700">Seite {img.pageNbr}</span>
                        <img src={img.data} className="border" />
                    </div>
                ))
            ) : <></>}
            <div
                ref={osmdEl}
                style={{width: "1448px", height: "1072px", position: 'absolute', visibility: 'hidden', marginLeft: '-99999px'}}
            ></div>

            <LoadingModal open={isLoading}>
                <LoadingBusyIndicator
                    msg="MXL Datei wird geladen..."
                    description="Wir bereiten dein MusicXML file zur weiteren Verarbeitung vor. Abhängig von Größe und Komplexität der MXL Datei, der Rechenleistung deines Computers, und anderen Faktoren kann dies einige Zeit in Anspruch nehmen."
                />
            </LoadingModal>
        </div>
    );

    function osmdInit() {
        const options = {
            backend: "canvas",
            autoResize: false,
            newPageFromXML: true,
            newSystemFromXML: true,
            pageBackgroundColor: '#FFFFFF',
            drawMeasureNumbersOnlyAtSystemStart: true,
            drawTitle: osmdOptions.drawTitle,
            drawSubtitle: osmdOptions.drawSubtitle,
            drawingParameters: osmdOptions.drawingParameters,
        };
        // sorry for the hack, try fix an osmd issue.
        osmdEl.current.innerHTML = '';

        const osmd = new OpenSheetMusicDisplay(osmdEl.current, options);
        osmd.EngravingRules.StemWidth = 0.2; // default 0.15. could be increased to 0.18 or something when increasing fontscale
        osmd.EngravingRules.StaffLineWidth = 0.15; // default 0.1
        osmd.EngravingRules.VexFlowDefaultNotationFontScale = 39; // default. scales notes, including rests
        osmd.EngravingRules.VexFlowDefaultTabFontScale = 39; // default. doesn't seem to do anything for now
        osmd.EngravingRules.StemWidth = 0.15; // default. should probably be adjusted when increasing vexFlowDefaultNotationFontScale.
        osmd.EngravingRules.StaffLineWidth = 0.10; //default. 1 pixels in vexflow. 2 pixels would be 0.20
        osmd.EngravingRules.LedgerLineWidth = 1; // default. vexflow units (pixels).
        osmd.EngravingRules.LedgerLineStrokeStyle = undefined; // if not undefined, the vexflow default will be overwritten.
        osmd.EngravingRules.LedgerLineColorDefault = "#000000"; // black, previously grey by default
        osmd.rules.VexFlowDefaultNotationFontScale = 45; // default 39, 42 or 45 looks good to me
        osmd.rules.LedgerLineWidth = 2; // default around 1.2
        osmd.rules.LedgerLineStrokeStyle = "#000000"; // color, default seems to be gray
        osmd.rules.PerformanceMode = true;      // new performance mode since v1.0.0
        osmd.rules.PageTopMargin = 0.2;
        osmd.rules.PageBottomMargin = 0.2;
        osmd.rules.PageLeftMargin = 0.2;
        osmd.rules.PageRightMargin = 0.2;
        osmd.rules.MinimumDistanceBetweenSystems = 0.2  // set via osmdOption?

        // dynamically set from osmdOptions
        osmd.rules.MinSkyBottomDistBetweenSystems = osmdOptions.skyBottomDistance;

        osmd.setCustomPageFormat(1448, 1072);

        osmd.load(props.data)
            .then(() => renderOsmdImage(osmd))
            .then(() => removeCanvases())
            .catch((e) => console.error('Error occured loading the Osmd in MxlToImageConverter', e));
    }

    /**
     * Render all image canvases from OSMD into an array of pages
     * which sits instead of a regular page element.
     *
     * @param {OpenSheetMusicDisplay} osmd
     */
    function renderOsmdImage(osmd) {
        try {
            osmd.Zoom = osmdOptions.zoom;

            osmd.render();

            let pagesCount = 0;
            let imagesFromOsmd = [];
            const osmdImageCanvases = document.getElementsByTagName('canvas');
            [...osmdImageCanvases].forEach((canvas, i) => {
                const iteration = i + 1;

                // Seraching for the actual osmd "page" nbr. Hopefully hidden within
                // the elements id looking like something like this: `osmdCanvasVexFlowBackendCanvas1`
                // !unfortunately not working, because freaking osmd gives all the canvases the same id!
                // @ToDo: Get osmd fixed from vendor (opensheetmusicdisplay)! Afterwards remove dirty osmd hack.
                const regex = /osmdCanvasVexFlowBackendCanvas([0-9]+)/g;
                const match = regex.exec(canvas.id);
                let pageNbr = match[1] ? parseInt(match[1]) : iteration;

                // again, sorry for the dirty hack to fix osmd's canvas id bugs (separate pages get the same id's)
                // ------------- try to cover the osmd bug as good as possible
                if (iteration === 1 && pageNbr !== 1) {
                    pageNbr = osmdImageCanvases.length;
                }
                const prevPageNbr = imagesFromOsmd[imagesFromOsmd.length - 1]?.pageNbr ?? 0;
                if (pageNbr === prevPageNbr) {
                    pageNbr = iteration;
                }
                // -------------

                imagesFromOsmd.push({
                    pageNbr,
                    data: canvas.toDataURL(),
                    type: 'mxl',
                    orientation: 'landscape',
                    origFile: props.origFileId,
                });
                pagesCount += 1;
            });
            const sortedPageImages = imagesFromOsmd.sort((a, b) => a.pageNbr - b.pageNbr);
            setPageImages(sortedPageImages);
            setPagesCount(pagesCount);
        } catch (e) {
            console.error('Error occured in MxlToImageConverter', e);
            setIsLoading(false);
            props.handleCloseOnError();
            props.dispatchFlashMessage('MXL Datei fehlerhaft! Bitte überprüfe die MXL Datei. Ist es eine MXL Version 3.0 Datei?');
        }
    }

    function renderZoomLevel(zoom) {
        setOsmdOptions(options => ({ ...options, zoom }));
    }

    function changeSkyBottomDistance(value) {
        setOsmdOptions(options => ({ ...options, skyBottomDistance: value }));
    }

    function changeCompactMode(value) {
        setOsmdOptions(options => ({
            ...options,
            drawingParameters: value ? 'compacttight' : 'default',      // or `compact` ?
        }));
    }

    function changeShowTitle(value) {
        setOsmdOptions(options => ({
            ...options,
            drawTitle: value,
            drawSubtitle: value,
        }));
    }

    function removeCanvases() {
        const canvasesCollection = document.getElementsByTagName('canvas');
        const canvases = [...canvasesCollection];
        if (canvases && canvases.length < 1) return;
        canvases.forEach(canvas => canvas.remove());
    }

    function removeRenderedOsmdImages() {
        const renderedBefore = document.getElementsByClassName('renderedOsmd');
        if (renderedBefore.length < 1) return;
        renderedBefore.forEach(div => div.remove());
    }
}

export default MxlToImageConverter;
