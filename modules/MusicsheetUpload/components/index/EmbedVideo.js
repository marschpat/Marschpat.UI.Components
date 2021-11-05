import React from 'react';
import Modal from '@material-ui/core/Modal';

function EmbedVideo(props) {
    return (
        <div>
            <div>Wie funktioniert der Uploader?</div>
            <Modal open={true} aria-labelledby="Wie funktioniert der Notenblatt Upload Video">
                <div>show me!</div>
            </Modal>
        </div>
    );
}

export default EmbedVideo;
