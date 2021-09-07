import React from 'react';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';

const PageImageExporter = props => {
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
                <span className="ml-12">Export Page Image</span>
            </Button>
        </div>
    );
};

export default PageImageExporter;
