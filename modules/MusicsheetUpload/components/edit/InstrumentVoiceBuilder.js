import React, { useEffect, useState } from 'react';
import ChooseOrCreateSelector from '@marschpat/Marschpat.UI.Components/components/ChooseOrCreateSelector';

const InstrumentVoiceBuilder = props => {
    const defaultVoice =
        props.assignedVoices.length > 0
            ? props.assignedVoices[0]
            : {
                  clef: null,
                  instrumentNew: null,
                  instrumentVoice: null,
                  label: null,
              };
    const [showWarning, setShowWarning] = useState(true);
    const [builtVoice, setBuiltVoice] = useState(defaultVoice);

    useEffect(() => {
        if (builtVoice.clef && builtVoice.instrumentNew && builtVoice.instrumentVoice) {
            setShowWarning(false);
            const labelText = getLabelText();
            props.handleVoicesAssignemnt([{ ...builtVoice, label: labelText }]);
        }
    }, [builtVoice]);

    function getLabelText() {
        return `${builtVoice.clef.name} - ${builtVoice.instrumentNew.name} - ${builtVoice.instrumentVoice.name}`;
    }

    return (
        <div className="mt-20">
            {/* CLEF */}
            <ChooseOrCreateSelector
                isFixed={true}
                label="Schlüssel"
                labelAttr="name"
                fetchOptionsUrl="/clef"
                initialValue={builtVoice.clef?.id ?? null}
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
                initialValue={builtVoice.instrumentNew?.id ?? null}
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
                initialValue={builtVoice.instrumentVoice?.id ?? null}
                handleSelectedChange={e => {
                    setBuiltVoice(prev => ({ ...prev, instrumentVoice: { id: e.id, name: e.name } }));
                }}
            />

            {showWarning && (
                <div className="mt-24 p-4 flex justify-center text-base rounded-md bg-orange-700">
                    <div>Schlüssel, Instrument und Variante auswählen!</div>
                </div>
            )}
        </div>
    );
};

export default InstrumentVoiceBuilder;
