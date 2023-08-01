import React, { useEffect, useState } from 'react';
import ChooseOrCreateSelector from '@marschpat/Marschpat.UI.Components/components/ChooseOrCreateSelector';
import { useTranslation } from 'react-i18next';

const InstrumentVoiceBuilder = props => {
    const { t } = useTranslation(['uploader']);
    const defaultVoice =
        props.assignedVoices.length > 0
            ? props.assignedVoices[0]
            : {
                  clef: { id: 0 },
                  instrumentNew: null,
                  instrumentVoice: null,
                  label: null,
              };
    const [showWarning, setShowWarning] = useState(true);
    const [builtVoice, setBuiltVoice] = useState(defaultVoice);

    useEffect(() => {
        if (builtVoice.instrumentNew && builtVoice.instrumentVoice) {
            setShowWarning(false);
            const labelText = getLabelText();
            props.handleVoicesAssignemnt([{ ...builtVoice, label: labelText }]);
        }
    }, [builtVoice]);

    function getLabelText() {
        return `${builtVoice.instrumentNew.name} - ${builtVoice.instrumentVoice.name}`;
    }

    return (
        <div>
            <p className="text-gray-700">{t('UPLOADER_SET_VOICE')}</p>
            <div className="mt-24">
                {/* INSTRUMENT */}
                <ChooseOrCreateSelector
                    isFixed={true}
                    label={t('UPLOADER_INSTRUMENT_LBL')}
                    labelAttr="name"
                    fetchOptionsUrl="/instrument-new"
                    initialValue={builtVoice.instrumentNew?.id ?? null}
                    handleSelectedChange={e => {
                        setBuiltVoice(prev => ({
                            ...prev,
                            instrumentNew: { id: e.id, name: e.name },
                        }));
                    }}
                />
                {/* VARIANT */}
                <ChooseOrCreateSelector
                    isFixed={true}
                    label={t('UPLOADER_VOICE_LBL')}
                    labelAttr="name"
                    fetchOptionsUrl="/instrument-voice"
                    initialValue={builtVoice.instrumentVoice?.id ?? null}
                    handleSelectedChange={e => {
                        setBuiltVoice(prev => ({
                            ...prev,
                            instrumentVoice: { id: e.id, name: e.name },
                        }));
                    }}
                />
                {showWarning && (
                    <div className="mt-68 px-10 py-5 flex justify-center rounded-md bg-red-200">
                        <p className="text-base text-gray-800 text-center">
                            {t('UPLOADER_INST_AND_VOICE_LBL')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstrumentVoiceBuilder;
