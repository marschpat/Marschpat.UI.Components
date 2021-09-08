import React, { useState } from 'react';

const ReviewPages = props => {
    const instrumentSheets = props.instrumentSheets;
    const [sheetIndex, setSheetIndex] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const type = instrumentSheets[sheetIndex]?.pages[pageIndex]?.type ?? 'image';

    return (
        <div className="mb-52">
            <h2>Review pages for each InstrumentSheet</h2>
            <div className="flex max-w-192 w-full mt-12">
                <div className="flex flex-col">
                    <label htmlFor="sheetIndex">InstrumentSheet Index</label>
                    <input
                        onChange={e => setSheetIndex(e.target.value)}
                        value={sheetIndex}
                        type="number"
                        name="sheetIndex"
                        min="0"
                        className="border"
                    />
                </div>
                <div className="ml-48 flex flex-col">
                    <label htmlFor="pageIndex">Page Index</label>
                    <input
                        onChange={e => setPageIndex(e.target.value)}
                        value={pageIndex}
                        type="number"
                        name="pageIndex"
                        min="0"
                        className="border"
                    />
                </div>
            </div>
            <div className="mt-24 border">
                {type !== 'mxl' ? (
                    <img src={instrumentSheets[sheetIndex]?.pages[pageIndex]?.pageData} />
                ) : (
                    <div>
                        MXLLLLL
                        <img src={instrumentSheets[sheetIndex]?.pages[0]?.pageData[pageIndex]?.data} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewPages;
