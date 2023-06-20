import React, { useState, useEffect } from 'react';
import Icon from '@material-ui/core/Icon';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

const InstrumentSheetFullscreenHeader = props => {
    const { t } = useTranslation(['uploader']);
    const [editMode, setEditMode] = useState(false);
    const modeTranslation = {
        mxl: 'MXL Editor',
        pdf: 'PDF Editor',
        image: `${t('UPLOADER_IMG')} Editor`,
    };

    useEffect(() => {
        setEditMode(modeTranslation[props.type]);
    }, [props.type]);

    return (
        <AppBar>
            <Toolbar>
                <div className="w-full flex justify-between items-center">
                    <div className="flex items-center">
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={props.handleClose}
                            aria-label="back"
                            title={t('UPLOADER_IMG_HEADER')}
                        >
                            <Icon>arrow_back</Icon>
                            <span className="ml-8">{t('UPLOADER_IMG_HEADER_BTN')}</span>
                        </IconButton>
                    </div>
                    <Typography variant="h6">
                        {editMode}: {props.name}
                    </Typography>
                    <div className="flex items-center">
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={props.handleClose}
                            aria-label="close"
                            title={t('UPLOADER_IMG_HEADER')}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default InstrumentSheetFullscreenHeader;
