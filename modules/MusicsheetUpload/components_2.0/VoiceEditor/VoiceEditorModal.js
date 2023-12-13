import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const VoiceEditorModal = ({
    open,
    title,
    text,
    confirmText,
    cancelText,
    objectName,
    onConfirm,
    onCancel,
}) => {
    const [isMobile] = useState(window.innerWidth < 720);
    const [name, setName] = useState(objectName);

    useEffect(() => {
        if (objectName != undefined && objectName != null) setName(objectName);
    }, [objectName]);

    return (
        <Dialog
            open={open}
            onClose={() => onCancel()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            classes={{ paper: 'rounded-lg' }}
        >
            <div className="p-24 pt-0 rounded-full">
                <DialogTitle id="alert-dialog-title" className="text-center font-bold text-xl">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" className="text-center">
                        {text + ' ' + name}
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="flex items-center justify-center">
                    {isMobile || (
                        <div className="flex items-center justify-center">
                            <Button
                                onClick={() => onCancel()}
                                style={{ textTransform: 'none' }}
                                className="flex items-left justify-center bg-grey-200 rounded-lg font-semibold text-lg pl-24 pr-24 mr-4 ml-4"
                            >
                                {cancelText}
                            </Button>
                            <Button
                                onClick={() => onConfirm()}
                                style={{ textTransform: 'none' }}
                                className="flex items-center justify-center bg-grey-200 rounded-lg font-semibold text-lg text-red-600 pl-24 pr-24 mr-4 ml-4"
                            >
                                {confirmText}
                            </Button>
                        </div>
                    )}
                    {isMobile && (
                        <div className="flex flex-col items-center">
                            <Button
                                onClick={() => onConfirm()}
                                style={{ textTransform: 'none' }}
                                className="items-center justify-center bg-gray-200 rounded-lg font-semibold text-lg w-full text-center p-8 pl-24 pr-24"
                            >
                                {confirmText}
                            </Button>
                            <Button
                                onClick={() => onCancel()}
                                style={{ textTransform: 'none' }}
                                className="items-center justify-center bg-gray-200 rounded-lg font-semibold text-lg text-red-600 w-full text-center mt-12 p-8 pl-24 pr-24"
                            >
                                {cancelText}
                            </Button>
                        </div>
                    )}
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default VoiceEditorModal;
