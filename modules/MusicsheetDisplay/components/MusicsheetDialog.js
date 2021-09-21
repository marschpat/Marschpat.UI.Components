import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import MusicsheetDisplay from './MusicsheetDisplay';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

const MusicsheetDialog = () => {
    const history = useHistory();
    const { musicsheetMetaData } = useContext(MusicsheetLoaderContext);
    const [isOpen, setIsOpen] = useState(!!musicsheetMetaData);

    return (
        <Dialog fullScreen open={isOpen} onClose={toggleDialog} TransitionComponent={Transition}>
            <div className="p-20">
                <MusicsheetDisplay handleClose={toggleDialog} />
            </div>
        </Dialog>
    );

    function toggleDialog() {
        setIsOpen(prev => !prev);
        history.goBack();
    }
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default MusicsheetDialog;
