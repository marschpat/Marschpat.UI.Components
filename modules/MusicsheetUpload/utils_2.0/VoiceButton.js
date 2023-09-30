import React, { useContext, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';

const VoiceButton = ({ voice, onVoiceClick }) => {
    return (
        <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            className="flex items-center bg-white mt-12 mr-12 rounded-full text-black"
            style={{ textTransform: 'none' }}
            onClick={onVoiceClick}
        >
            <span className="text-s not-uppercase">{voice.label}</span>
        </Button>
    );
};

export default VoiceButton;
