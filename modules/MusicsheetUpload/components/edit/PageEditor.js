import React from 'react';
import ImageCropper from './ImageCropper';
import MxlToImageConverter from './MxlToImageConverter';
import PdfToImageConverter from './PdfToImageConverter';
import { useTranslation } from 'react-i18next';

const PageEditor = props => {
    const { t } = useTranslation(['uploader']);
    const page = props.page;
    const originalFileData = props.originalFile.data;
    const editType = props.supportedTypes.includes(page.type) ? page.type : 'no-support';
    const getAppropriateEditor = () => {
        if (editType === 'image') {
            return (
                <ImageCropper
                    src={originalFileData}
                    cropBox={page.cropBox}
                    handlePageImageUpdate={handlePageEdit}
                    handleCropBoxOverrideForPages={props.handleCropBoxOverrideForPages}
                />
            );
        }
        if (editType === 'pdf') {
            return (
                <PdfToImageConverter
                    data={originalFileData}
                    documentPageNbr={page.pageNbr}
                    orientation={page.cropBox?.orientation}
                    cropBox={page.cropBox}
                    handlePageImageUpdate={handlePageEdit}
                    handleCropBoxOverrideForPages={props.handleCropBoxOverrideForPages}
                />
            );
        }
        if (editType === 'mxl') {
            return (
                <MxlToImageConverter
                    data={props.originalFile.blob}
                    origFileId={props.originalFile.uuid}
                    osmdOptions={page.osmdOptions}
                    handlePageImageUpdate={handlePageEdit}
                    handleCloseOnError={props.handleCloseOnError}
                />
            );
        }

        return (
            <div className="text-gray-600 text-center italic">{t('UPLOADER_NOT_SUPPORTED')}</div>
        );
    };

    return (
        <div className="p-32 bg-gray-100 border border-gray-300 rounded-md shadow-md">
            {getAppropriateEditor()}
        </div>
    );

    function handlePageEdit(editedPageDataUrl, cropBox = null, osmdOptions = null) {
        props.handlePageUpdate({
            ...page,
            type: editType,
            pageData: editedPageDataUrl,
            cropBox: cropBox,
            osmdOptions: osmdOptions,
            orientation: cropBox?.orientation ?? 'landscape',
        });
    }
};

export default PageEditor;
