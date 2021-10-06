import React, { useContext, useEffect, useState } from 'react';
import { UploaderContext } from '../../context/UploaderContext';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import Typography from '@material-ui/core/Typography';
import { MP_EDU } from '../../utils/ImplementationModesLookup';

const VoicesAssignmentSelection = props => {
    const [availableVoices, setAvailableVoices] = useState(null);
    const [showWarning, setShowWarning] = useState(null);
    const { availableInstrumentVoices, implementationMode } = useContext(UploaderContext);

    const handleChange = (values, detail) => {
        // if removed value isn't included in availableVoices yet, reinclude it
        if (detail.action === 'remove-value') {
            setAvailableVoices(prev => {
                let newAvailable = prev;
                const removedValue = detail.removedValue;
                if (
                    removedValue &&
                    removedValue.voiceID &&
                    !newAvailable.find(item => item.voiceID === removedValue.voiceID)
                ) {
                    newAvailable.push(removedValue);
                    newAvailable = newAvailable.sort(compareByVoiceId);
                }
                return newAvailable;
            });
        }
        props.handleVoicesAssignemnt(values);
    };

    useEffect(() => {
        if (!availableInstrumentVoices) {
            setShowWarning(true);
        }
        if (availableInstrumentVoices) {
            setAvailableVoices(availableInstrumentVoices);
        }
    }, [availableInstrumentVoices]);

    return (
        <div className="w-full">
            <Typography variant="h5">
                {implementationMode === MP_EDU ? 'Stimme festlegen' : 'Stimme auswählen'}
            </Typography>
            <FuseChipSelect
                className="mt-8"
                value={props.assignedVoices}
                onChange={handleChange}
                placeholder="Instrumentenstimme wählen"
                textFieldProps={{ variant: 'standard' }}
                options={availableVoices}
                isMulti
                variant="fixed"
                id="voices-assignment"
            />
            {showWarning && (
                <div className="mt-24 py-4 flex justify-center text-xl rounded-md bg-orange-700">
                    <span>! Bitte zuerst Besetzung auswählen !</span>
                </div>
            )}
        </div>
    );
};

function compareByVoiceId(itemA, itemB) {
    if (itemA.voiceID < itemB.voiceID) return -1;
    if (itemA.voiceID > itemB.voiceID) return 1;
    return 0;
}

export default VoicesAssignmentSelection;
