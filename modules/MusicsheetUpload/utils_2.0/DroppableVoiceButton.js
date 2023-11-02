import React, { useContext, useMemo } from 'react';
import { UploaderContext } from '../context/UploaderContext';
import { useDropzone } from 'react-dropzone';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';

const DroppableVoiceButton = ({ voice, allowedExtensions, onVoiceClick, onDrop }) => {
    const { selectedMusicPieceIndex } = useContext(UploaderContext);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => onDrop(selectedMusicPieceIndex, voice)(acceptedFiles),
        noClick: true,
    });

    return (
        <div {...getRootProps({ className: 'cursor-pointer' })} id={selectedMusicPieceIndex}>
            <input {...getInputProps()} accept={allowedExtensions} className="w-full h-full" />
            {!voice.disabled && (
                <Button
                    variant="contained"
                    className="flex items-center bg-white mt-12 mr-12 rounded-full text-black"
                    style={{
                        textTransform: 'none',
                    }}
                    onClick={() => onVoiceClick(voice, selectedMusicPieceIndex)}
                >
                    <div className="mr-4">
                        <AddCircleOutlineIcon />
                    </div>
                    <span className="text-s not-uppercase mt-2">{voice.label}</span>
                </Button>
            )}
            {voice.disabled && (
                <div className="flex items-center bg-grey-500 mt-12 mr-12 p-8 rounded-full text-grey-300">
                    <div className="mr-4">
                        <AddCircleOutlineIcon />
                    </div>
                    <span className="text-s not-uppercase mt-2">{voice.label}</span>
                </div>
            )}
        </div>
    );
};

export default DroppableVoiceButton;
