import React from 'react';
import ChooseOrCreateSelector from '@marschpat/Marschpat.UI.Components/components/ChooseOrCreateSelector';

const InstrumentVoiceBuilder = props => {
    return (
        <div className="mt-20">
            {/* CLEF */}
            <ChooseOrCreateSelector
                isFixed={true}
                label="Stimmung"
                labelAttr="name"
                fetchOptionsUrl="/clef"
                handleSelectedChange={e => console.log('changed', e)}
            />

            {/* INSTRUMENT */}
            <ChooseOrCreateSelector
                isFixed={true}
                label="Instrument"
                labelAttr="name"
                fetchOptionsUrl="/instrument-new"
                handleSelectedChange={e => console.log('changed', e)}
            />

            {/* VARIANT */}
            <ChooseOrCreateSelector
                isFixed={true}
                label="Stimmung"
                labelAttr="name"
                fetchOptionsUrl="/instrument-voice"
                handleSelectedChange={e => console.log('changed', e)}
            />
        </div>
    );
};

export default InstrumentVoiceBuilder;
