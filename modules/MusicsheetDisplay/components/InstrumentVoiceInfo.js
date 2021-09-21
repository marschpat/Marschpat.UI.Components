import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';

const InstrumentVoiceInfo = ({ voice }) => {
    const { instrumentVoice } = useContext(MusicsheetLoaderContext);

    return <Typography>Stimme: {instrumentVoice.name}</Typography>;
};

export default InstrumentVoiceInfo;
