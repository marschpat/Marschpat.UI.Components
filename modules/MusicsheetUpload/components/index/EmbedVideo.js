import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import TheatersIcon from '@material-ui/icons/Theaters';

function EmbedVideo(props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>
                <div className="flex items-center">
                    <TheatersIcon />
                    <div className="ml-8">Video ansehen</div>
                </div>
            </Button>
            <Modal
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="absolute p-20 flex items-center justify-center"
                aria-labelledby="Wie funktioniert der Notenblatt Upload Video"
            >
                <div className="bg-gray-50 rounded-md w-full max-w-xl">
                    <div className="flex justify-end">
                        <IconButton onClick={() => setIsOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className="px-24 pb-24">
                        <iframe
                            width="1120"
                            height="630"
                            className="w-full"
                            src="https://www.youtube.com/embed/wUd48D-hQ5M"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default EmbedVideo;
