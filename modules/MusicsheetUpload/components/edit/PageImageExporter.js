import React from 'react';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useTranslation } from 'react-i18next';

const PageImageExporter = props => {
    const { t } = useTranslation(['uploader']);
    return (
        <div className="flex justify-end mt-12">
            <Button
                href={props.data ? props.data : ''}
                download="page-export.png"
                className="flex justify-center"
                variant="contained"
                color="primary"
            >
                <GetAppIcon />
                <span className="ml-12">{t('UPLOADER_PAGE_EXPORT')}</span>
            </Button>
        </div>
    );
};

export default PageImageExporter;
