import React from 'react';
import { useTranslation } from 'react-i18next';

const InfoPlaceholder = ({numberOfNoteSheets}) => {
    const { t } = useTranslation(['uploader']);
    
    return (
        <section className="block w-full h-full p-6 ml-6 bg-gray-200  border border-gray-200 shadow pb-24">
            <div className="flex flex-wrap items-center justify-center pt-128 pb-128 text-center">
            <div className="flex flex-col items-center justify-center pt-128 p-24 w-full text-gray-700 text-lg mb-4 font-semibold">
                <div>{numberOfNoteSheets + " " + t('UPLOADER_MUSICPIECESUPLOADED')}</div>
            </div>
            <div className="flex flex-col items-center justify-center pt-24 pb-24 pl-48 pr-48 w-full text-gray-700 text-m mb-4 font-normal">
                <div>{t('UPLOADER_MUSICPIECESUPLOADED_DESC')}</div>
            </div>
            <div className="flex flex-col items-center justify-center pt-12 pl-48 pr-48 pb-128 w-full text-gray-700 text-m mb-4 font-normal">
                <div>{t('UPLOADER_MUSICPIECESUPLOADED_TIPP')}</div>
            </div>
            </div>
        </section>
    );
};

export default InfoPlaceholder;
