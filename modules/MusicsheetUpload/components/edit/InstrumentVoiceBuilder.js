import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import ChooseOrCreateSelector from '@marschpat/Marschpat.UI.Components/components/ChooseOrCreateSelector';

const InstrumentVoiceBuilder = props => {
    return (
        <div className="mt-20">
            {/* CLEF */}
            <ChooseOrCreateSelector
                label="Stimmung"
                fetchOptionsUrl="/clef"
                labelAttr="name"
                handleSelectedChange={e => console.log('changed', e)}
            />

            {/* INSTRUMENT */}
            <ChooseOrCreateSelector
                label="Instrument"
                fetchOptionsUrl="/instrument-new"
                labelAttr="name"
                handleSelectedChange={e => console.log('changed', e)}
            />

            {/* VARIANT */}
            <ChooseOrCreateSelector
                label="Stimmung"
                fetchOptionsUrl="/instrument-voice"
                labelAttr="name"
                handleSelectedChange={e => console.log('changed', e)}
            />
        </div>
    );
};

export default InstrumentVoiceBuilder;
