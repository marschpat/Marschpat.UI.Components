import React from 'react';
import PageExtractor from './PageExtractor';

const OriginalFileManipulator = props => {
    const allowedTypes = ['pdf', 'image'];
    const pageNbr = props.pageNbr ?? 1;
    const instrumentSheet = props.currentInstrumentSheet;
    const page = props.pages.find(page => page.pageNbr == pageNbr);
    const originalFile = instrumentSheet.origFiles.find(file => file.uuid === page.belongsToOrigFile);
    const renderFileManipulator = allowedTypes.includes(originalFile.type) && props.pages.length > 1;
    const originalFileIndex = instrumentSheet.origFiles.findIndex(origFile => origFile.uuid === originalFile.uuid);

    return (
        renderFileManipulator && (
            <div className="mt-32 px-32">
                <PageExtractor
                    {...props}
                    pageNbr={pageNbr}
                    originalFile={originalFile}
                    originalFileIndex={originalFileIndex}
                />
            </div>
        )
    );
};

export default OriginalFileManipulator;
