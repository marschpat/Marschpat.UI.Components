import React from 'react';
import Modal from '@material-ui/core/Modal';

const LoadingModal = props => {

    return (
        <Modal
            open={props.open}
            aria-labelledby="Bitte warten."
            className="absolute p-20 flex items-center justify-center"
        >
            <div className="p-48 bg-gray-50 rounded-md">
                {props.children}
             </div>
        </Modal>
    );
}

export default LoadingModal;
