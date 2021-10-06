import React, { useContext } from 'react';
import { UploaderContext } from '../../context/UploaderContext';
import InstrumentVoicesSelector from './InstrumentVoicesSelector';
import InstrumentVoiceConstructor from './InstrumentVoiceConstructor';
import { MP_EDU, MP_WEB } from '../../utils/ImplementationModesLookup';
import Typography from '@material-ui/core/Typography';

const InstrumentVoicesAssignement = props => {
    const { implementationMode } = useContext(UploaderContext);

    return (
        <div className="w-full">
            <Typography variant="h5">
                {implementationMode === MP_EDU ? 'Stimme festlegen' : 'Stimme auswählen'}
            </Typography>

            {implementationMode === MP_WEB && (
                <InstrumentVoicesSelector
                    assignedVoices={props.assignedVoices}
                    handleVoicesAssignemnt={props.handleVoicesAssignemnt}
                />
            )}

            {implementationMode === MP_EDU && <InstrumentVoiceConstructor />}
        </div>
    );
};

export default InstrumentVoicesAssignement;
