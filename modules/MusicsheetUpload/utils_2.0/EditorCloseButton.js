import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';

const EditorCloseButton = ({ onClick, isMobile }) => {
    const [openCofirmationModal, setOpenConfirmationModal] = useState(false);
    const { t } = useTranslation(['uploader']);

    const handleClick = () => {
        handleConfirmation();
    };

    const handleConfirmation = () => {
        setOpenConfirmationModal(true);
    };

    const handleClose = () => {
        setOpenConfirmationModal(false);
    };

    const handleConfirm = () => {
        setOpenConfirmationModal(false);
        onClick();
    };

    return (
        <div>
            <Button
                aria-label="delete"
                className="flex-shrink-0 grid grid-cols-1 justify-center items-center space-y-2 content-center"
                onClick={handleClick}
            >
                <CloseIcon style={{ color: 'white' }} className="ml-12" />

                <p className="text-s text-grey-300" style={{ textTransform: 'none' }}>
                    {t('EDITOR_CLOSE_TEXT')}
                </p>
            </Button>
            <Dialog
                open={openCofirmationModal}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{ paper: 'rounded-lg' }}
            >
                <div className="p-24 rounded-full">
                    <DialogTitle id="alert-dialog-title" className="text-center font-bold text-xl">
                        {t('EDITOR_CLOSE_TITLE')}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className="text-center">
                            {t('EDITOR_CLOSE_INFO')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="flex items-center justify-center">
                        {isMobile || (
                            <div className="flex items-center justify-center">
                                <Button
                                    onClick={handleClose}
                                    style={{ textTransform: 'none' }}
                                    className="flex items-left justify-center bg-grey-200 rounded-lg font-semibold text-lg pl-24 pr-24 mr-4 ml-4"
                                >
                                    {t('EDITOR_CLOSE_CANCEL')}
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    style={{
                                        textTransform: 'none',
                                        backgroundColor: 'rgb(220, 173, 85)',
                                        active: { backgroundColor: 'rgb(220, 173, 85)' },
                                        hover: { backgroundColor: 'rgb(220, 173, 85)' },
                                    }}
                                    className="flex items-center justify-center rounded-lg font-semibold text-lg pl-24 pr-24 mr-4 ml-4 text-white"
                                >
                                    {t('EDITOR_CLOSE_CONFIRM')}
                                </Button>
                            </div>
                        )}
                        {isMobile && (
                            <div className="flex flex-col items-center">
                                <Button
                                    onClick={handleConfirm}
                                    style={{
                                        textTransform: 'none',
                                        backgroundColor: 'rgb(220, 173, 85)',
                                        active: { backgroundColor: 'rgb(220, 173, 85)' },
                                        hover: { backgroundColor: 'rgb(220, 173, 85)' },
                                    }}
                                    className="items-center justify-center bg-gray-200 rounded-lg font-semibold text-lg w-full text-white text-center p-8 pl-24 pr-24"
                                >
                                    {t('EDITOR_CLOSE_CONFIRM')}
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    style={{ textTransform: 'none' }}
                                    className="items-center justify-center bg-gray-200 rounded-lg font-semibold text-lg w-full text-center mt-12 p-8 pl-24 pr-24"
                                >
                                    {t('EDITOR_CLOSE_CANCEL')}
                                </Button>
                            </div>
                        )}
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
};

export default EditorCloseButton;
