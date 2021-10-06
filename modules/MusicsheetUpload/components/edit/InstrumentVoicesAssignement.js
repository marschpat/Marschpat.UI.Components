import React, { useContext } from 'react';
import { MP_EDU } from '../../utils/ImplementationModesLookup';
import { UploaderContext } from '../../context/UploaderContext';
import InstrumentVoicesSelector from './InstrumentVoicesSelector';
import Typography from '@material-ui/core/Typography';

const InstrumentVoicesAssignement = props => {
    const { implementationMode } = useContext(UploaderContext);

    return (
        <div className="w-full">
            <Typography variant="h5">
                {implementationMode === MP_EDU ? 'Stimme festlegen' : 'Stimme auswählen'}
            </Typography>

            <InstrumentVoicesSelector
                assignedVoices={props.assignedVoices}
                handleVoicesAssignemnt={props.handleVoicesAssignemnt}
            />
        </div>
    );
};

export default InstrumentVoicesAssignement;
