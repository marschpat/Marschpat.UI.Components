import React from 'react';

const PagesOverviewPageThumbnail = ({ thumbnail, handleClick }) => {
    const pageNbr = thumbnail?.pageNbr ?? 1;

    return (
        <div
            className={
                'h-128 mr-36 mb-20 p-4 rounded-md cursor-pointer ' +
                (thumbnail.isActive ? 'border-2 border-mp-gold' : 'border')
            }
            onClick={() => handleClick(thumbnail.pageNbr)}
        >
            <div className="relative h-full flex items-center">
                <div className="absolute top-0 left-0 z-10">
                    <div className="px-4 py-2 text-gray-800 bg-gray-50">Seite {pageNbr}</div>
                </div>
                <div className="p-2 max-h-full overflow-hidden">
                    {thumbnail.preview ? (
                        <img
                            src={thumbnail?.preview}
                            alt={`Seite ${pageNbr} preview`}
                            title={`Seite ${pageNbr}`}
                            width="320"
                        />
                    ) : (
                        'keine Vorschau'
                    )}
                </div>
            </div>
        </div>
    );
};

export default PagesOverviewPageThumbnail;
