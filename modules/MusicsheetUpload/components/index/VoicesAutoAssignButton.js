import React, { useContext } from 'react';
import { UploaderContext } from '../../context/UploaderContext';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import IconButton from '@material-ui/core/IconButton';
import PageviewOutlinedIcon from '@material-ui/icons/PageviewOutlined';

const VoicesAutoAssignButton = props => {
    const { dispatchFlashMessage } = useContext(UploaderContext);
    const handleClick = () => {
        if (!props.handleCastCheck()) return false;
        autoAssignVoices();
    };

    /**
     * Try to match voices by id if instrumentSheet hasn't assigned voices
     * Get filename of each origFile, find matching voices if filename === voiceId
     */
    const autoAssignVoices = () => {
        const voices = props.availableVoices;
        let alreadyAssignedVoices = [];
        const newInstrumentSheets = props.instrumentSheets.map(sheet => {
            if (sheet.voices && sheet.voices.length > 0) return sheet;
            const origFileNames = sheet.origFiles
                .map(file => {
                    const fileName = file.name.split('.');
                    return fileName[0] ?? null;
                })
                .filter(name => name);
            let matchingVoices = [];
            origFileNames.forEach(name => {
                const voice = voices.find(voice => voice.voiceId === parseInt(name));
                if (voice && !alreadyAssignedVoices.includes(voice)) {
                    matchingVoices.push(voice);
                    alreadyAssignedVoices.push(voice);
                }
            });
            sheet.voices = matchingVoices;
            return sheet;
        });
        props.handleInstrumentSheetsUpdate(newInstrumentSheets);
        props.handleAssignedVoicesChange();
        dispatchFlashMessage('Automatische Stimmenzuordnung durchgeführt', 'success');
    };

    return (
        <div>
            <TooltipStyled title="Automatische Stimmenzuordnung versuchen?">
                <IconButton onClick={handleClick} aria-label="auto-assign-voices">
                    <PageviewOutlinedIcon />
                </IconButton>
            </TooltipStyled>
        </div>
    );
};

export default VoicesAutoAssignButton;
