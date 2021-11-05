import React, { useContext, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import TheatersIcon from '@material-ui/icons/Theaters';
import { UploaderContext } from '../../context/UploaderContext';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';

function EmbedVideo(props) {
    const [isOpen, setIsOpen] = useState(false);
    const { inHelpMode } = useContext(UploaderContext);

    return (
        inHelpMode && (
            <div>
                <TooltipStyled title="Wie funktioniert der Uploader">
                    <Button onClick={() => setIsOpen(true)}>
                        <div className="flex items-center text-base text-orange-300 font-bold">
                            <TheatersIcon />
                            <div className="ml-8">Video ansehen</div>
                        </div>
                    </Button>
                </TooltipStyled>
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
        )
    );
}

export default EmbedVideo;
