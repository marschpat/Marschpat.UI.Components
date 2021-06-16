import React, { useState, useEffect } from 'react';
import InstrumentSheetEditor from './components/edit/InstrumentSheetEditor';
import InstrumentSheetFullscreenHeader from './components/edit/InstrumentSheetFullscreenHeader';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';

const InstrumentSheetEditDialog = props => {
    const [open, setOpen] = useState(false);
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="left" ref={ref} {...props} />;
    });
    useEffect(() => setOpen(props.open), [props.open]);
    const handleClose = e => {
        setOpen(false);
        props.handleClose();
    }

    return open && (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <InstrumentSheetFullscreenHeader
                name={props.instrumentSheet?.origFiles[0].name}
                type={props.instrumentSheet?.origFiles[0].type}
                handleClose={handleClose}
            />
            <div className="mt-24 px-24 py-84">
                <InstrumentSheetEditor { ...props } />
            </div>
        </Dialog>
    );
}

export default InstrumentSheetEditDialog;
