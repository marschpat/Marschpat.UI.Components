import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';

const SaveButton = ({ text, onClick, licenseCheckRequired, isMobile }) => {
    const { t } = useTranslation(['uploader']);
    const [openLicenseCheckModal, setOpenLicenseCheckModal] = useState(false);

    const handeClick = () => {
        if(licenseCheckRequired) handleLicenseCheck();
        else onClick();
    }

    const handleLicenseCheck = () => {
        setOpenLicenseCheckModal(true);
    }

    const handleClose = () => {
        setOpenLicenseCheckModal(false);
    }

    const handleConfirm = () => {
        setOpenLicenseCheckModal(false);
        console.log("Confirm", text);
        onClick();
    }


    return (
        <div className="App flex space-x-4">
            <Button
                onClick={handeClick}
                className="bg-gray-200"
                style={{ textTransform: 'none', backgroundColor: 'rgb(220, 173, 85)', active:{backgroundColor: 'rgb(220, 173, 85)'}, hover:{backgroundColor: 'rgb(220, 173, 85)'}}}
            >
                <div className="flex items-center justify-center font-semibold text-xl text-white pl-8 pr-8">
                    { text }
                </div>
            </Button>
            <Dialog
                open={openLicenseCheckModal}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{ paper: 'rounded-lg' }}
            >
                <div className="p-24 rounded-full">
                    <DialogTitle id="alert-dialog-title" className="text-center font-bold text-xl">{t('UPLOADER_ACCEPT_NOTICE')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className="text-center">
                            {t('UPLOADER_LEGAL_CONSENT')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="flex items-center justify-center">
                        {isMobile || <div className="flex items-center justify-center">
                            <Button 
                                onClick={handleClose}  
                                style={{ textTransform: 'none' }} 
                                className="flex items-left justify-center bg-grey-200 rounded-lg font-semibold text-lg pl-24 pr-24 mr-4 ml-4"
                            >
                                {t('UPLOADER_ACCEPT_NOT')}
                            </Button>
                            <Button 
                                onClick={handleConfirm}         
                                style={{ textTransform: 'none', backgroundColor: 'rgb(220, 173, 85)', active:{backgroundColor: 'rgb(220, 173, 85)'}, hover:{backgroundColor: 'rgb(220, 173, 85)'}}}
                                className="flex items-center justify-center rounded-lg font-semibold text-lg pl-24 pr-24 mr-4 ml-4 text-white"
                            >
                                {t('UPLOADER_ACCEPT')}
                            </Button>
                        </div>}
                        {isMobile && 
                        <div className="flex flex-col items-center">
                            <Button 
                                onClick={handleConfirm} 
                                style={{ textTransform: 'none', backgroundColor: 'rgb(220, 173, 85)', active:{backgroundColor: 'rgb(220, 173, 85)'}, hover:{backgroundColor: 'rgb(220, 173, 85)'}}} 
                                className="items-center justify-center bg-gray-200 rounded-lg font-semibold text-lg w-full text-white text-center p-8 pl-24 pr-24"
                            >
                                {t('UPLOADER_ACCEPT')}
                            </Button>
                            <Button 
                                onClick={handleClose}  
                                style={{ textTransform: 'none' }} 
                                className="items-center justify-center bg-gray-200 rounded-lg font-semibold text-lg w-full text-center mt-12 p-8 pl-24 pr-24"
                            >
                                {t('UPLOADER_ACCEPT_NOT')}
                            </Button>
                        </div>}
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}

export default SaveButton;