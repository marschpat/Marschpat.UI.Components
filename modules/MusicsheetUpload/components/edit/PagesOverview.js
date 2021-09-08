import React, { useState, useEffect } from 'react';
import MxlInfo from './MxlInfo';
import PagesOverviewPageThumbnail from './PagesOverviewPageThumbnail';

const PagesOverview = ({ previews, pageNbrInEdit = 1, renderPagesPreview, handlePageInEditChange }) => {
    const [pageThumbnails, setPageThumbails] = useState([]);

    useEffect(() => {
        if (previews) {
            const currentPreviews = previews.map(preview => ({
                pageNbr: preview.pageNbr,
                isActive: preview.pageNbr === pageNbrInEdit,
                preview: preview.thumbnail,
            }));

            setPageThumbails(currentPreviews);
        }
    }, [previews, pageNbrInEdit]);

    return (
        <div className="flex flex-col">
            {renderPagesPreview ? (
                pageThumbnails.map(item => (
                    <PagesOverviewPageThumbnail
                        thumbnail={item}
                        key={item?.pageNbr}
                        handleClick={handlePageInEditChange}
                    />
                ))
            ) : (
                <MxlInfo />
            )}
        </div>
    );
};

export default PagesOverview;
