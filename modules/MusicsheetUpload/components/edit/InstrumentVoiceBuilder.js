import React, { useEffect, useState } from 'react';
import ChooseOrCreateSelector from '@marschpat/Marschpat.UI.Components/components/ChooseOrCreateSelector';

const InstrumentVoiceBuilder = props => {
    const [showWarning, setShowWarning] = useState(true);
    const [builtVoice, setBuiltVoice] = useState({
        clef: null,
        instrumentNew: null,
        instrumentVoice: null,
    });

    useEffect(() => {
        if (builtVoice.clef && builtVoice.instrumentNew && builtVoice.instrumentVoice) {
            setShowWarning(false);
            props.handleVoicesAssignemnt([builtVoice]);
        }
    }, [builtVoice]);

    return (
        <div className="mt-20">
            {/* CLEF */}
            <ChooseOrCreateSelector
                isFixed={true}
                label="Stimmung"
                labelAttr="name"
                fetchOptionsUrl="/clef"
                handleSelectedChange={e => {
                    setBuiltVoice(prev => ({ ...prev, clef: { id: e.id, name: e.name } }));
                }}
            />

            {/* INSTRUMENT */}
            <ChooseOrCreateSelector
                isFixed={true}
                label="Instrument"
                labelAttr="name"
                fetchOptionsUrl="/instrument-new"
                handleSelectedChange={e => {
                    setBuiltVoice(prev => ({ ...prev, instrumentNew: { id: e.id, name: e.name } }));
                }}
            />

            {/* VARIANT */}
            <ChooseOrCreateSelector
                isFixed={true}
                label="Variante"
                labelAttr="name"
                fetchOptionsUrl="/instrument-voice"
                handleSelectedChange={e => {
                    setBuiltVoice(prev => ({ ...prev, instrumentVoice: { id: e.id, name: e.name } }));
                }}
            />

            {showWarning && (
                <div className="mt-24 p-4 flex justify-center text-base rounded-md bg-orange-700">
                    <div>Stimmung, Instrument und Variante auswählen!</div>
                </div>
            )}
        </div>
    );
};

export default InstrumentVoiceBuilder;
